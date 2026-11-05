"""Regenerate the concise public CV: python3 scripts/generate_cv.py.

Requires reportlab. The exhaustive source CV is deliberately not published.
"""
from pathlib import Path
from shutil import copyfile
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/bucket/abdallah.kassan.pdf'
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='NameCV', fontName='Helvetica-Bold', fontSize=24, leading=29, textColor=colors.HexColor('#142536'), spaceAfter=8))
styles.add(ParagraphStyle(name='TitleCV', fontName='Helvetica', fontSize=12, leading=17, textColor=colors.HexColor('#077488'), spaceAfter=10))
styles.add(ParagraphStyle(name='SectionCV', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=colors.HexColor('#077488'), spaceBefore=18, spaceAfter=9))
styles.add(ParagraphStyle(name='BodyCV', fontName='Helvetica', fontSize=9.3, leading=14, textColor=colors.HexColor('#263849'), spaceAfter=6, alignment=TA_LEFT))
styles.add(ParagraphStyle(name='SmallCV', parent=styles['BodyCV'], fontSize=8.1, leading=12, textColor=colors.HexColor('#526171')))
styles.add(ParagraphStyle(name='JobCV', parent=styles['BodyCV'], fontName='Helvetica-Bold', fontSize=10, spaceBefore=9, spaceAfter=6))
story = []
plain = []
def add(text, style='BodyCV'):
    story.append(Paragraph(text, styles[style]))
    import re
    plain.append(re.sub('<[^>]+>', '', text.replace('<br/>', '\n')).replace('&amp;', '&'))
def bullet(text): add('• ' + text)
def section(text): add(text, 'SectionCV')

add('ABDALLAH KASSAN', 'NameCV')
add('Ingénieur logiciel · Systèmes intelligents &amp; IA embarquée', 'TitleCV')
add('Caen, France · Mobilité France · +33 7 88 09 35 91<br/>abdallah.kassan.job@outlook.fr<br/>linkedin.com/in/kassan-abdallah · github.com/kassanabdallah0', 'SmallCV')
section('PROFIL')
add('Ingénieur diplômé de l’Université de Technologie de Troyes, avec plus de deux ans en CDI chez Fastpoint. Je conçois et livre des produits de bout en bout : interfaces React/TypeScript, API Python et Node.js, services AWS et vision embarquée sur NVIDIA Jetson. Une approche qui relie besoin utilisateur, qualité logicielle et exploitation en production.')
section('EXPÉRIENCE PROFESSIONNELLE')
add('FASTPOINT — Ingénieur logiciel Full Stack', 'JobCV')
add('CDI · Caen · Septembre 2024 – aujourd’hui', 'SmallCV')
add('<b>SecuriSPOT Manager — Interfaces et supervision industrielle</b>')
bullet('Conception et développement de l’application React/TypeScript et du backend Python/Flask : configuration graphique des zones, flux caméra, détections, alarmes et historique à chargement différé.')
bullet('Configuration d’une zone ramenée de 30–60 min avec intervention technique à moins de 2 min en libre-service ; application utilisée sur environ 5 à 6 installations.*')
add('<b>Vision industrielle — Python, YOLO/TensorRT et Jetson Orin</b>')
bullet('Contribution au backend multiprocessus, optimisation des exports de modèles et réduction des transferts d’images entre processus ; règles temporelles de suivi d’objet.')
bullet('Pipeline de traitement passé d’environ 5 à 30 images/s ; réduction estimée de plus de 80 % des fausses alertes dans les scénarios observés.*')
add('<b>MediaSpot — Cloud AWS et flotte de bus connectés</b>')
bullet('Migration de 70 bus vers AWS, suppression de 70 PC embarqués, configuration réseau et accès OpenVPN par certificats sur routeurs Teltonika.')
bullet('Backend Node.js/TypeScript en architecture hexagonale, API REST et Lambda, JWT/IAM ; portail React, lecteur PDF progressif et refonte du reporting mensuel CloudWatch/EventBridge/SES.')
add('<b>Livraison et fiabilité des systèmes embarqués</b>')
bullet('Chaîne GitLab CI/CD versionnée, tests Jest/pytest, images Docker, contrôles matériels et applicatifs sur Jetson et retour arrière automatique en cas d’échec récupérable.')
bullet('Mise à jour du code sur un Jetson provisionné : environ 3 h à moins de 5 min ; restauration en moins de 2 min dans les cas récupérables. Déploiement final déclenché localement.*')
add('* Résultats issus d’estimations et d’observations terrain rapportées dans le CV de référence, sans benchmark indépendant. Périmètres et conditions détaillés dans les études de cas du portfolio.', 'SmallCV')
story.append(PageBreak())
add('ABDALLAH KASSAN', 'NameCV')
add('Parcours, compétences &amp; formation', 'TitleCV')
section('AUTRES EXPÉRIENCES')
add('KEOS Telecom — Développeur web Full Stack', 'JobCV')
add('Stage · Paris · Juillet – décembre 2023', 'SmallCV')
bullet('Développement et maintenance d’une application métier interne PHP/MySQL : fonctionnalités frontend/backend, requêtes SQL, corrections, tests et documentation technique.')
add('HMRexpert — Développeur logiciel / traitement d’image', 'JobCV')
add('Stage · Bourgogne-Franche-Comté · Février – juillet 2022', 'SmallCV')
bullet('Application Qt sous Linux et modules OpenCV : développement, intégration, tests et documentation des traitements d’image.')
section('COMPÉTENCES TECHNIQUES')
add('<b>Interfaces &amp; produit</b> — React, TypeScript, JavaScript, HTML/CSS, MUI, i18n, tableaux de bord, chargement différé, WebRTC, Chromium/Weston.')
add('<b>Backend &amp; architecture</b> — Node.js, Express, Python, Flask, API REST, contrats typés, architecture hexagonale, PHP, JWT.')
add('<b>IA, vidéo &amp; embarqué</b> — NVIDIA Jetson Orin/Xavier, Intel RealSense, OpenCV, YOLO/Ultralytics, TensorRT, PyTorch, Roboflow, GStreamer ; optimisation de pipelines et suivi d’objets.')
add('<b>Cloud &amp; réseau</b> — AWS EC2, Lambda, API Gateway, S3, CloudWatch, EventBridge, SES, IAM, VPC, OpenVPN, TLS et diagnostic réseau.')
add('<b>Données &amp; exploitation</b> — SQL, PostgreSQL, MySQL, DynamoDB, Elasticsearch/Logstash/Kibana ; maintenance de cluster, rétention ILM, certificats et analyse de logs.')
add('<b>Livraison &amp; qualité</b> — Git, GitLab CI/CD, Docker, Linux, Bash, AWS CLI, Jest, pytest, smoke tests, health checks, retour arrière et diagnostic en production.')
add('<b>Compléments</b> — Notions de C/C++ et Qt acquises en formation et projets ; formation TensorFlow. Pas de revendication d’expérience professionnelle en développement firmware C/C++.', 'SmallCV')
section('FORMATION & CERTIFICATIONS')
add('<b>Diplôme d’ingénieur — Université de Technologie de Troyes (UTT)</b><br/>2021 – 2024 · Systèmes de Réseaux Convergents')
add('<b>TensorFlow — Coursera</b><br/>Certificat professionnel et spécialisation.')
section('LANGUES & APPROCHE')
add('Français : professionnel · Anglais : professionnel · Arabe : langue maternelle.')
add('Autonomie, résolution de problèmes, approche produit, communication technique et collaboration.')
add('Portfolio : kassanabdallah0.github.io/portofolio/', 'SmallCV')

def footer(canvas, doc):
    canvas.setStrokeColor(colors.HexColor('#d9e1e8'))
    canvas.line(44, 37, A4[0]-44, 37)
    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(colors.HexColor('#526171'))
    canvas.drawString(44, 24, 'Abdallah Kassan · CV synthétique · Novembre 2026')
    canvas.drawRightString(A4[0]-44, 24, f'{doc.page}')

SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=44, leftMargin=44, topMargin=37, bottomMargin=49, title='Abdallah Kassan - Ingénieur logiciel et IA embarquée', author='Abdallah Kassan').build(story, onFirstPage=footer, onLaterPages=footer)
copyfile(OUT, ROOT/'bucket/abdallah.kassan.pdf')
(ROOT/'public/bucket/CV_Abdallah_Kassan_ATS.txt').write_text('\n\n'.join(plain)+'\n', encoding='utf-8')
# Preserve the previous Word download URL with the same updated content.
from zipfile import ZipFile, ZIP_DEFLATED
from xml.sax.saxutils import escape
paragraphs = ''.join('<w:p><w:r><w:t xml:space="preserve">'+escape(line)+'</w:t></w:r></w:p>' for block in plain for line in block.split('\n'))
with ZipFile(ROOT/'public/bucket/CV_Abdallah_Kassan_ATS.docx', 'w', ZIP_DEFLATED) as docx:
    docx.writestr('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
    docx.writestr('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
    docx.writestr('word/document.xml', '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+paragraphs+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850"/></w:sectPr></w:body></w:document>')
print(f'Generated {OUT}')
