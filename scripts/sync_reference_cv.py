"""Publish an unchanged reference PDF and refresh its legacy exports.

Usage: python3 scripts/sync_reference_cv.py /path/to/reference.pdf
Requires Poppler (pdftotext and pdftoppm); no PDF rewriting library is used.
"""
import argparse
import hashlib
from pathlib import Path
import shutil
import subprocess
from xml.sax.saxutils import escape
from zipfile import ZipFile, ZIP_DEFLATED

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
source = parser.parse_args().source.resolve()
root = Path(__file__).resolve().parents[1]
if not source.read_bytes().startswith(b'%PDF-'):
    raise SystemExit('The source must be a PDF file.')
targets = [root / 'public/bucket/CV_Reference_Abdallah_Kassan_2026.pdf',
           root / 'public/bucket/abdallah.kassan.pdf',
           root / 'bucket/abdallah.kassan.pdf']
for target in targets:
    if target.resolve() != source:
        shutil.copyfile(source, target)
text = subprocess.check_output(['pdftotext', '-layout', str(source), '-'], text=True)
(root / 'public/bucket/CV_Abdallah_Kassan_ATS.txt').write_text(text, encoding='utf-8')
paragraphs = ''.join('<w:p><w:r><w:t xml:space="preserve">'+escape(line)+'</w:t></w:r></w:p>' for line in text.replace('\f', '\n').splitlines())
with ZipFile(root / 'public/bucket/CV_Abdallah_Kassan_ATS.docx', 'w', ZIP_DEFLATED) as docx:
    docx.writestr('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
    docx.writestr('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
    docx.writestr('word/document.xml', '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+paragraphs+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850"/></w:sectPr></w:body></w:document>')
subprocess.run(['pdftoppm', '-f', '1', '-singlefile', '-scale-to', '850', '-jpeg', '-jpegopt', 'quality=80', str(source), str(root / 'public/cv-reference-preview')], check=True)
digest = hashlib.sha256(source.read_bytes()).hexdigest()
assert all(hashlib.sha256(target.read_bytes()).hexdigest() == digest for target in targets)
print(f'Published unchanged reference PDF (SHA-256: {digest})')
