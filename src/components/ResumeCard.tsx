import Image from 'next/image';
import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { profile } from '@/data/portfolio';

export default function ResumeCard() {
  return (
    <aside
      className="resume-card glass glass--dark glass--raised"
      aria-labelledby="resume-title"
    >
      <div className="resume-card-heading">
        <FileText size={17} />
        <span>CV DE RÉFÉRENCE</span>
        <span className="resume-format">PDF</span>
      </div>
      <a
        className="resume-preview"
        href={profile.cv}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ouvrir le CV de référence en PDF"
      >
        <Image
          src="/portofolio/cv-reference-preview.jpg"
          alt="Première page du CV de référence d’Abdallah Kassan"
          width={601}
          height={850}
          sizes="(max-width: 768px) 350px, 310px"
        />
        <span className="resume-preview-action">
          Voir le document <ArrowUpRight size={15} />
        </span>
      </a>
      <div className="resume-card-content">
        <p className="eyebrow">4 PAGES · OCTOBRE 2026</p>
        <h3 id="resume-title">Le parcours complet.</h3>
        <p>
          Réalisations, choix techniques, résultats et compétences, dans mon CV
          de référence.
        </p>
        <a
          href={profile.cv}
          download={profile.cvFilename}
          className="button button-primary"
        >
          <Download size={16} />
          Télécharger mon CV
        </a>
      </div>
    </aside>
  );
}
