import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Check,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  GitBranch,
  Mail,
  MapPin,
  Search,
  Server,
} from 'lucide-react';
import { usePreferences } from '@/context/preferences';
import {
  profile,
  projects,
  categories,
  skills,
  experiences,
} from '@/data/portfolio';
import type { Category, Project } from '@/data/portfolio';
import { ContactCTA, CVLink, PageHeading, Tags } from '@/components/Site';
import { ProjectCard, ProjectVisual } from '@/components/ProjectCard';

export function HomePage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="availability">
            <span className="status-dot" />
            {fr
              ? 'À la recherche d’un CDI · France entière'
              : 'Seeking a permanent role · France'}
          </p>
          <p className="hero-intro">
            {fr ? 'Bonjour, moi c’est Abdallah.' : 'Hi, I’m Abdallah.'}
          </p>
          <h1>
            {fr ? 'Développeur' : 'Full Stack'}
            <br />
            <span>{fr ? 'Full Stack.' : 'Developer.'}</span>
          </h1>
          <p className="hero-stack">React / TypeScript · Python · Node.js</p>
          <p className="hero-description">
            {fr
              ? 'Des interfaces web aux API, jusqu’aux systèmes de vision embarquée. Je développe des applications qui relient le logiciel au terrain.'
              : 'From web interfaces and APIs to edge vision systems. I build applications that connect software to the real world.'}
          </p>
          <div className="button-row">
            <a className="button" href="#/projects">
              {fr ? 'Explorer mes projets' : 'Explore my projects'}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <CVLink secondary />
          </div>
          <p className="hero-location">
            <MapPin size={15} aria-hidden="true" /> Caen, France <span>·</span>{' '}
            {fr ? 'Ingénieur UTT' : 'UTT engineering graduate'}
          </p>
        </div>
        <div
          className="hero-art"
          role="img"
          aria-label={
            fr
              ? 'Schéma de mon travail : interfaces React, API Python et Node.js, services AWS et vision sur Jetson.'
              : 'My work: React interfaces, Python and Node.js APIs, AWS services and Jetson vision.'
          }
        >
          <div className="art-caption">
            <span className="status-dot" />
            {fr ? 'DU WEB AU TERRAIN' : 'FROM WEB TO FIELD'}
            <span>01—03</span>
          </div>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-node interface-node">
            <div className="node-icon">
              <Code2 />
            </div>
            <div>
              <small>01 / INTERFACE</small>
              <strong>React + TypeScript</strong>
              <p>
                {fr
                  ? 'Configurer. Visualiser. Interagir.'
                  : 'Configure. Visualize. Interact.'}
              </p>
            </div>
            <span className="node-dot" />
          </div>
          <div className="connector">
            <span>REST API</span>
          </div>
          <div className="art-node api-node">
            <div className="node-icon">
              <Server />
            </div>
            <div>
              <small>02 / BACKEND</small>
              <strong>Python + Node.js</strong>
              <p>
                {fr
                  ? 'Intégrer. Traiter. Automatiser.'
                  : 'Integrate. Process. Automate.'}
              </p>
            </div>
            <span className="node-dot" />
          </div>
          <div className="connector">
            <span>
              {fr ? 'LIVRAISON & INTÉGRATION' : 'DELIVERY & INTEGRATION'}
            </span>
          </div>
          <div className="art-node edge-node">
            <div className="node-icon">
              <Cpu />
            </div>
            <div>
              <small>03 / CLOUD & EDGE</small>
              <strong>AWS + NVIDIA Jetson</strong>
              <p>
                {fr
                  ? 'Déployer. Observer. Maintenir.'
                  : 'Deploy. Observe. Maintain.'}
              </p>
            </div>
            <span className="node-dot" />
          </div>
          <div className="art-footnote">
            <GitBranch size={15} /> GitLab CI/CD <span>·</span> Docker{' '}
            <span>·</span> Linux
          </div>
        </div>
      </section>
      <div className="credentials-strip">
        <div>
          <strong>{fr ? 'Depuis 2024' : 'Since 2024'}</strong>
          <span>
            {fr
              ? 'Développement chez Fastpoint'
              : 'Software development at Fastpoint'}
          </span>
        </div>
        <div>
          <strong>Web + API + Cloud</strong>
          <span>
            {fr
              ? 'Une pratique de bout en bout'
              : 'An end-to-end development practice'}
          </span>
        </div>
        <div>
          <strong>{fr ? 'Vision embarquée' : 'Edge vision'}</strong>
          <span>
            {fr
              ? 'Une expérience complémentaire'
              : 'A complementary area of experience'}
          </span>
        </div>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {fr ? 'Sélection de réalisations' : 'Selected work'}
            </p>
            <h2>
              {fr
                ? 'Du code. Des usages concrets.'
                : 'Code with a practical purpose.'}
            </h2>
          </div>
          <a className="text-link" href="#/projects">
            {fr ? 'Tous les projets' : 'All projects'}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="project-grid featured-grid">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <section className="intro-section">
        <div>
          <p className="eyebrow">{fr ? 'Mon profil' : 'My background'}</p>
          <h2>
            {fr
              ? 'Le web comme métier. Le terrain comme contexte.'
              : 'Web development, grounded in real systems.'}
          </h2>
        </div>
        <div>
          <p>{profile.summary[language]}</p>
          <p>
            {fr
              ? 'Je recherche une équipe où contribuer au développement d’un produit et continuer à progresser comme Software Engineer.'
              : 'I’m looking for a team where I can contribute to a product and continue growing as a software engineer.'}
          </p>
          <a className="text-link" href="#/about">
            {fr ? 'En savoir plus sur moi' : 'More about me'}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function ProjectsPage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const visible = projects.filter(
    (project) =>
      (category === 'all' || project.category === category) &&
      normalize(
        `${project.name[language]} ${project.summary[language]} ${project.stack.join(' ')}`,
      ).includes(normalize(query.trim())),
  );
  return (
    <>
      <PageHeading
        eyebrow={
          fr
            ? 'Projets professionnels · Fastpoint'
            : 'Professional projects · Fastpoint'
        }
        title={fr ? 'Ce que j’ai développé.' : 'What I’ve built.'}
      >
        {fr
          ? 'Des études de cas pour comprendre le besoin, ma contribution et le résultat. Chaque projet précise son périmètre et les technologies utilisées.'
          : 'Case studies covering the need, my contribution and the outcome. Each project explains its scope and the technologies used.'}
      </PageHeading>
      <div className="project-controls">
        <div
          className="filter-group"
          role="group"
          aria-label={fr ? 'Filtrer par domaine' : 'Filter by area'}
        >
          {categories.map((item) => (
            <button
              key={item.id}
              className={`filter-button ${category === item.id ? 'selected' : ''}`}
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.label[language]}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">
            {fr ? 'Rechercher un projet' : 'Search projects'}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={fr ? 'Projet, technologie…' : 'Project, technology…'}
          />
        </label>
      </div>
      <p className="result-count" aria-live="polite">
        {visible.length}{' '}
        {fr
          ? `projet${visible.length !== 1 ? 's' : ''}`
          : `project${visible.length !== 1 ? 's' : ''}`}
      </p>
      {visible.length ? (
        <div className="project-grid">
          {visible.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={30} aria-hidden="true" />
          <h2>{fr ? 'Aucun projet trouvé' : 'No projects found'}</h2>
          <p>
            {fr
              ? 'Essayez une autre technologie ou retirez les filtres.'
              : 'Try another technology or clear the filters.'}
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setCategory('all');
              setQuery('');
            }}
          >
            {fr ? 'Réinitialiser' : 'Reset filters'}
          </button>
        </div>
      )}
      <p className="project-disclosure">
        {fr
          ? 'Ces projets ont été réalisés chez Fastpoint. Je présente mes contributions ; les dépôts professionnels et les données internes restent privés.'
          : 'These projects were completed at Fastpoint. I describe my contributions; professional repositories and internal data remain private.'}
      </p>
      <ContactCTA />
    </>
  );
}

export function ProjectPage({ project }: { project: Project }) {
  const { language } = usePreferences();
  const fr = language === 'fr';
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <a className="back-link" href="#/projects">
        <ArrowLeft size={16} aria-hidden="true" />
        {fr ? 'Tous les projets' : 'All projects'}
      </a>
      <PageHeading
        eyebrow={`${project.number} / FASTPOINT`}
        title={project.name[language]}
      >
        {project.subtitle[language]}
      </PageHeading>
      <div className="case-meta">
        <div>
          <span>{fr ? 'Ma contribution' : 'My contribution'}</span>
          <strong>{project.role[language]}</strong>
        </div>
        <div>
          <span>{fr ? 'Cadre' : 'Context'}</span>
          <strong>
            {fr
              ? 'Projet professionnel · travail en équipe'
              : 'Professional project · teamwork'}
          </strong>
        </div>
      </div>
      <ProjectVisual project={project} large />
      <div className="case-layout">
        <div className="case-body">
          <section>
            <h2>{fr ? 'Le contexte' : 'Context'}</h2>
            <p>{project.context[language]}</p>
          </section>
          <section>
            <h2>{fr ? 'Le problème à résoudre' : 'The challenge'}</h2>
            <p>{project.challenge[language]}</p>
          </section>
          <section>
            <h2>{fr ? 'Ce que j’ai réalisé' : 'What I contributed'}</h2>
            <ul className="achievement-list">
              {project.actions.map((action, i) => (
                <li key={i}>{action[language]}</li>
              ))}
            </ul>
          </section>
          <section className="outcome-panel">
            <p className="eyebrow">
              {fr ? 'Résultats concrets' : 'Concrete outcomes'}
            </p>
            <h2>{fr ? 'Ce que cela a permis.' : 'What it enabled.'}</h2>
            {project.results.map((result, i) => (
              <p key={i} className="outcome">
                <Check size={19} aria-hidden="true" />
                <span>{result[language]}</span>
              </p>
            ))}
          </section>
          <section>
            <h2>{fr ? 'Ce que j’en retiens' : 'What I learned'}</h2>
            <p>{project.lesson[language]}</p>
          </section>
        </div>
        <aside className="case-sidebar">
          <h2>Stack</h2>
          <Tags items={project.stack} />
          <h2>{fr ? 'Périmètre & précision' : 'Scope & context'}</h2>
          <p>{project.note[language]}</p>
          <a className="text-link" href="#/contact">
            {fr ? 'Échanger sur ce projet' : 'Discuss this project'}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </aside>
      </div>
      <a className="next-project" href={`#/projects/${next.slug}`}>
        <span>
          <small>{fr ? 'Projet suivant' : 'Next project'}</small>
          <strong>{next.name[language]}</strong>
        </span>
        <ArrowRight size={28} aria-hidden="true" />
      </a>
    </>
  );
}

export function ExperiencePage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  return (
    <>
      <PageHeading
        eyebrow={fr ? 'Expérience professionnelle' : 'Professional experience'}
        title={
          fr
            ? 'Un parcours ancré dans le développement.'
            : 'A background in building software.'
        }
      >
        {fr
          ? 'Du développement d’applications métier aux interfaces web, API cloud et systèmes de vision embarquée.'
          : 'From business applications to web interfaces, cloud APIs and embedded vision systems.'}
      </PageHeading>
      <div className="timeline">
        {experiences.map((experience, i) => (
          <article className="timeline-entry" key={experience.company}>
            <div className="timeline-date">
              <span className="timeline-dot" />
              <strong>{experience.period[language]}</strong>
              <span>{experience.type[language]}</span>
            </div>
            <div className="timeline-content">
              <p className="eyebrow">{experience.company}</p>
              <h2>{experience.role[language]}</h2>
              <p>{experience.description[language]}</p>
              <ul className="achievement-list">
                {experience.achievements.map((item, index) => (
                  <li key={index}>{item[language]}</li>
                ))}
              </ul>
              {i === 0 && (
                <a className="text-link" href="#/projects">
                  {fr
                    ? 'Découvrir les réalisations en détail'
                    : 'Explore the work in detail'}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="button-row">
        <CVLink />
        <a className="button secondary" href="#/about">
          {fr ? 'Formation & profil' : 'Education & background'}
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
      <ContactCTA />
    </>
  );
}

export function SkillsPage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  return (
    <>
      <PageHeading
        eyebrow={fr ? 'Compétences techniques' : 'Technical skills'}
        title={
          fr
            ? 'Des technologies mises en pratique.'
            : 'Technologies put into practice.'
        }
      >
        {fr
          ? 'Mon socle : React/TypeScript, Python et Node.js. AWS, la livraison logicielle et la vision embarquée complètent mon expérience de développement.'
          : 'My core stack is React/TypeScript, Python and Node.js. AWS, software delivery and edge vision complement my development experience.'}
      </PageHeading>
      <div className="skills-grid">
        {skills.map((skill, i) => (
          <article className="skill-card" key={skill.title.en}>
            <span className="skill-number">0{i + 1}</span>
            <h2>{skill.title[language]}</h2>
            <Tags items={skill.stack} />
            <p>{skill.description[language]}</p>
            <a className="text-link" href={`#/projects/${skill.project}`}>
              {fr ? 'Voir une réalisation' : 'See it in practice'}
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> — {skill.title[language]}</span>
            </a>
          </article>
        ))}
      </div>
      <ContactCTA />
    </>
  );
}

export function AboutPage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  return (
    <>
      <PageHeading
        eyebrow={fr ? 'À propos' : 'About me'}
        title={
          fr
            ? 'Abdallah, développeur Full Stack.'
            : 'Abdallah, Full Stack Developer.'
        }
      >
        {profile.summary[language]}
      </PageHeading>
      <div className="about-layout">
        <div className="about-copy">
          <section>
            <h2>{fr ? 'Ce que je recherche' : 'What I’m looking for'}</h2>
            <p>
              {fr
                ? 'Un CDI en France comme développeur Full Stack, Backend ou Software Engineer, à un niveau junior. Je souhaite contribuer à un produit au sein d’une équipe qui partage ses pratiques et accompagne la progression technique.'
                : 'A permanent role in France as a junior Full Stack Developer, Backend Developer or Software Engineer. I want to contribute to a product in a team that shares engineering practices and supports technical growth.'}
            </p>
            <p>
              {fr
                ? 'Les applications connectées, la supervision et les logiciels industriels m’intéressent particulièrement : j’y retrouve le lien entre interfaces, services et équipements que j’ai connu chez Fastpoint.'
                : 'Connected applications, monitoring and industrial software particularly interest me: they bring together the interfaces, services and devices I have worked with at Fastpoint.'}
            </p>
          </section>
          <section>
            <h2>
              {fr ? 'Ma manière de travailler' : 'How I approach development'}
            </h2>
            <p>
              {fr
                ? 'Je pars d’un usage concret, je relie les différentes couches de l’application et je m’appuie sur les logs pour comprendre les problèmes. Mes projets m’ont amené à traiter aussi bien une interaction React qu’une conversion de date, un échec d’envoi de rapport ou une reprise après déploiement.'
                : 'I start from a concrete use case, connect application layers and use logs to understand problems. My projects have involved React interactions as well as date conversion, report-delivery failures and recovery after deployment.'}
            </p>
          </section>
        </div>
        <aside className="profile-panel">
          <div className="initials" aria-hidden="true">
            ak.
          </div>
          <h2>Abdallah Kassan</h2>
          <p>{profile.title[language]}</p>
          <dl>
            <dt>{fr ? 'Localisation' : 'Location'}</dt>
            <dd>Caen, France</dd>
            <dt>{fr ? 'Mobilité' : 'Mobility'}</dt>
            <dd>{fr ? 'France entière' : 'Anywhere in France'}</dd>
            <dt>{fr ? 'Recherche' : 'Seeking'}</dt>
            <dd>
              {fr ? 'CDI · niveau junior' : 'Permanent role · junior level'}
            </dd>
          </dl>
          <CVLink secondary />
        </aside>
      </div>
      <section className="education-section">
        <p className="eyebrow">
          {fr ? 'Formation & langues' : 'Education & languages'}
        </p>
        <div className="education-grid">
          <article>
            <span className="small-label">2021 — 2024</span>
            <h2>{fr ? 'Diplôme d’ingénieur' : 'Engineering degree'}</h2>
            <p>Université de Technologie de Troyes</p>
            <strong>
              {fr
                ? 'Systèmes de Réseaux Convergents'
                : 'Convergent Network Systems'}
            </strong>
          </article>
          <article>
            <h2>{fr ? 'Langues de travail' : 'Languages'}</h2>
            <dl className="language-list">
              <dt>{fr ? 'Français' : 'French'}</dt>
              <dd>{fr ? 'Professionnel' : 'Professional'}</dd>
              <dt>{fr ? 'Anglais' : 'English'}</dt>
              <dd>{fr ? 'Professionnel' : 'Professional'}</dd>
              <dt>{fr ? 'Arabe' : 'Arabic'}</dt>
              <dd>{fr ? 'Langue maternelle' : 'Native'}</dd>
            </dl>
          </article>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}

export function CVPage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  const base = `${import.meta.env.BASE_URL}bucket/`;
  return (
    <>
      <PageHeading
        eyebrow={fr ? 'CV & téléchargements' : 'Resume & downloads'}
        title={
          fr ? 'Mon parcours, en une page.' : 'My background, in one page.'
        }
      >
        {fr
          ? 'CV en français, adapté à une candidature CDI Full Stack / Software Engineer. Version mise à jour en septembre 2026.'
          : 'French resume for permanent Full Stack / Software Engineer roles. Updated in September 2026.'}
      </PageHeading>
      <div className="cv-actions">
        <CVLink />
        <a
          className="button secondary"
          href={`${base}CV_Abdallah_Kassan_ATS.docx`}
          download
        >
          <FileText size={17} aria-hidden="true" />
          {fr ? 'Version ATS · Word' : 'ATS version · Word (FR)'}
        </a>
        <a
          className="text-link"
          href={`${base}CV_Abdallah_Kassan_ATS.txt`}
          download
        >
          <Download size={16} aria-hidden="true" />
          {fr ? 'Texte brut' : 'Plain text (FR)'}
        </a>
      </div>
      <div className="cv-preview">
        <div className="preview-toolbar">
          <span>CV_Abdallah_Kassan.pdf</span>
          <a
            href={`${base}abdallah.kassan.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {fr ? 'Ouvrir le PDF' : 'Open PDF'}
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
        <iframe
          src={`${base}abdallah.kassan.pdf#toolbar=0`}
          title={
            fr
              ? 'Aperçu du CV d’Abdallah Kassan en français'
              : 'Preview of Abdallah Kassan’s French resume'
          }
        />
        <p className="preview-fallback">
          {fr
            ? 'Si l’aperçu n’est pas disponible sur votre appareil, utilisez les liens de téléchargement ci-dessus.'
            : 'If the preview is unavailable on your device, use the download links above.'}
        </p>
      </div>
    </>
  );
}

export function ContactPage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );
  const [prepared, setPrepared] = useState(false);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const company = String(data.get('company') || '').trim();
    const message = String(data.get('message') || '').trim();
    const messageInput = event.currentTarget.elements.namedItem(
      'message',
    ) as HTMLTextAreaElement;
    messageInput.setCustomValidity(
      message.length < 10
        ? fr
          ? 'Ajoutez un message d’au moins 10 caractères.'
          : 'Add a message of at least 10 characters.'
        : '',
    );
    if (!event.currentTarget.reportValidity()) return;
    const subject = `${fr ? 'Contact portfolio' : 'Portfolio enquiry'} — ${company || name}`;
    const body = `${message}\n\n${name}\n${company ? `${company}\n` : ''}${email}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  }
  return (
    <>
      <PageHeading
        eyebrow={
          fr ? 'Contact · recherche CDI' : 'Contact · permanent opportunities'
        }
        title={fr ? 'Parlons de votre équipe.' : 'Let’s talk about your team.'}
      >
        {fr
          ? 'Vous recrutez un développeur junior React, Python ou Node.js ? Je suis basé à Caen et mobile dans toute la France.'
          : 'Hiring a junior React, Python or Node.js developer? I’m based in Caen and open to relocation throughout France.'}
      </PageHeading>
      <div className="contact-layout">
        <div className="contact-details">
          <p className="small-label">EMAIL</p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <button className="text-link copy-button" onClick={copyEmail}>
            <Copy size={15} aria-hidden="true" />
            {fr ? 'Copier l’adresse' : 'Copy email address'}
          </button>
          <p className="copy-status" role="status">
            {copyStatus === 'copied'
              ? fr
                ? 'Adresse copiée.'
                : 'Address copied.'
              : copyStatus === 'failed'
                ? fr
                  ? 'Copie indisponible : sélectionnez l’adresse ci-dessus pour la copier.'
                  : 'Copy unavailable: select the address above to copy it.'
                : ''}
          </p>
          <div className="contact-item">
            <span>{fr ? 'Téléphone' : 'Phone'}</span>
            <a href={profile.phoneHref}>{profile.phone}</a>
          </div>
          <div className="contact-item">
            <span>
              {fr ? 'Localisation & mobilité' : 'Location & mobility'}
            </span>
            <p>{fr ? 'Caen · France entière' : 'Caen · Anywhere in France'}</p>
          </div>
          <div className="contact-profiles">
            {[
              ['LinkedIn', profile.linkedin],
              ['GitHub', profile.github],
              ['GitLab', profile.gitlab],
            ].map(([label, href]) => (
              <a
                className="text-link"
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
          <CVLink secondary />
        </div>
        <form className="contact-form" onSubmit={prepareEmail}>
          <h2>{fr ? 'Préparer un message' : 'Prepare a message'}</h2>
          <p className="form-description">
            {fr
              ? 'Ce formulaire ouvre votre messagerie avec un brouillon. Vous choisissez ensuite de l’envoyer.'
              : 'This form opens an email draft in your mail application. You choose whether to send it.'}
          </p>
          <div className="form-row">
            <label>
              {fr ? 'Nom *' : 'Name *'}
              <input name="name" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              {fr ? 'Entreprise' : 'Company'}
              <input
                name="company"
                autoComplete="organization"
                maxLength={120}
              />
            </label>
          </div>
          <label>
            Email *
            <input
              name="email"
              autoComplete="email"
              type="email"
              required
              maxLength={200}
            />
          </label>
          <label>
            Message *
            <textarea
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={2000}
              onChange={(event) => {
                event.target.setCustomValidity('');
                setPrepared(false);
              }}
              placeholder={
                fr
                  ? 'Le poste, votre équipe, le lieu…'
                  : 'The role, your team, the location…'
              }
            />
          </label>
          <button className="button" type="submit">
            <Mail size={17} aria-hidden="true" />
            {fr ? 'Ouvrir ma messagerie' : 'Open my mail application'}
          </button>
          <p className="form-note">
            {fr
              ? '* Champs obligatoires. Aucun message n’est envoyé ou enregistré par ce site.'
              : '* Required fields. This site does not send or store any messages.'}
          </p>
          <div role="status">
            {prepared && (
              <p className="form-status">
                {fr
                  ? 'Brouillon préparé pour votre messagerie. Aucun message n’a été envoyé par le site. Si rien ne s’ouvre, écrivez directement à l’adresse indiquée.'
                  : 'Draft prepared for your mail application. No message was sent by this site. If nothing opens, write directly to the email address shown.'}
              </p>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export function PrivacyPage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  return (
    <>
      <PageHeading
        eyebrow={fr ? 'Informations du site' : 'Site information'}
        title={fr ? 'Confidentialité & contact.' : 'Privacy & contact.'}
      />
      <div className="prose">
        <h2>{fr ? 'Éditeur' : 'Publisher'}</h2>
        <p>
          Abdallah Kassan · Caen, France ·{' '}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
        <h2>{fr ? 'Hébergement' : 'Hosting'}</h2>
        <p>
          GitHub Pages — GitHub, Inc.{' '}
          <a
            href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
          >
            {fr
              ? 'Politique de confidentialité de GitHub'
              : 'GitHub privacy statement'}
          </a>
          .
        </p>
        <h2>{fr ? 'Préférences locales' : 'Local preferences'}</h2>
        <p>
          {fr
            ? 'Le site conserve uniquement votre choix de langue et de thème dans le stockage local de votre navigateur. Vous pouvez les supprimer dans les paramètres du navigateur. Aucun outil publicitaire ou de mesure d’audience n’est intégré.'
            : 'The site only stores your language and theme preferences in your browser’s local storage. You can clear them through your browser settings. No advertising or analytics tools are included.'}
        </p>
        <h2>Messages</h2>
        <p>
          {fr
            ? 'Le formulaire prépare un lien email et ne transmet pas vos champs à un serveur du portfolio. L’envoi dépend de votre messagerie et de votre validation. Les liens externes vous dirigent vers les services concernés.'
            : 'The form prepares an email link and does not submit your fields to a portfolio server. Sending depends on your mail application and your confirmation. External links lead to their respective services.'}
        </p>
        <h2>{fr ? 'Projets professionnels' : 'Professional projects'}</h2>
        <p>
          {fr
            ? 'Les études de cas décrivent mes contributions à des projets réalisés chez Fastpoint. Les schémas sont simplifiés et ne constituent pas des captures d’écrans de production. Le code source professionnel et les données internes ne sont pas diffusés.'
            : 'Case studies describe my contributions to projects at Fastpoint. Diagrams are simplified and are not production screenshots. Professional source code and internal data are not distributed.'}
        </p>
      </div>
    </>
  );
}

export function NotFoundPage() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  return (
    <div className="not-found">
      <PageHeading
        eyebrow="404"
        title={fr ? 'Cette page n’existe pas.' : 'This page doesn’t exist.'}
      >
        {fr
          ? 'Le lien a peut-être changé. Retrouvez mes projets ou revenez à l’accueil.'
          : 'The link may have changed. Explore my projects or return home.'}
      </PageHeading>
      <div className="button-row">
        <a className="button" href="#/">
          {fr ? 'Retour à l’accueil' : 'Back home'}
          <ArrowRight size={17} aria-hidden="true" />
        </a>
        <a className="button secondary" href="#/projects">
          {fr ? 'Voir les projets' : 'View projects'}
        </a>
      </div>
    </div>
  );
}
