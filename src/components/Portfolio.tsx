'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  Menu,
  Network,
  X,
} from 'lucide-react';
import {
  expertise,
  approach,
  impact,
  navigation,
  profile,
  projects,
  technologies,
  technologyMarks,
  timeline,
} from '@/data/portfolio';
import type { Project } from '@/data/portfolio';
import CoreVisual from './CoreVisual';
import EngineeringDemo from './EngineeringDemo';
import ResumeCard from './ResumeCard';

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: [reduced ? 0 : 16, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduced ? 0 : 0.65,
        delay,
        ease: [0.2, 0.7, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <p className="section-label">
      <span>{number}</span>
      <span className="section-label-line" />
      {children}
    </p>
  );
}

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <a
      href={href}
      className={className}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== 'mouse') return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          '--mx',
          `${(event.clientX - rect.left - rect.width / 2) * 0.06}px`,
        );
        event.currentTarget.style.setProperty(
          '--my',
          `${(event.clientY - rect.top - rect.height / 2) * 0.09}px`,
        );
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty('--mx', '0px');
        event.currentTarget.style.setProperty('--my', '0px');
      }}
    >
      {children}
    </a>
  );
}

function Logo() {
  return (
    <a href="#accueil" className="logo" aria-label="Abdallah Kassan — accueil">
      <span className="logo-mark">
        a<span>k</span>
        <i />
      </span>
      <span className="logo-name">
        Abdallah Kassan<span>INGÉNIEUR LOGICIEL</span>
      </span>
    </a>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('accueil');
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24);
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-12% 0px -65% 0px', threshold: 0 },
    );
    navigation.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => {
      window.removeEventListener('scroll', scroll);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open]);
  return (
    <header
      className={`site-header glass glass--navigation ${scrolled || open ? 'is-scrolled' : ''}`}
    >
      <div className="nav-shell">
        <Logo />
        <nav
          aria-label="Navigation principale"
          id="navigation"
          className={open ? 'main-nav is-open' : 'main-nav'}
        >
          {navigation.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              onClick={() => {
                setOpen(false);
                setActive(id);
              }}
            >
              {label}
            </a>
          ))}
          <a
            className="mobile-contact"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            Contact <ArrowUpRight size={14} />
          </a>
        </nav>
        <a href="#contact" className="nav-contact">
          Parlons de votre projet <ArrowUpRight size={15} />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function DomainDiagram() {
  return (
    <div
      className="domain-diagram"
      aria-label="Domaines reliés : ingénierie logicielle, intelligence artificielle, systèmes embarqués et cloud connecté"
    >
      <svg viewBox="0 0 520 360" fill="none" aria-hidden="true">
        <ellipse cx="260" cy="180" rx="166" ry="105" stroke="#263d4b" />
        <circle cx="260" cy="180" r="58" stroke="#215260" />
        <path
          d="M260 75v210M94 180h332"
          stroke="#2c5360"
          strokeDasharray="3 6"
        />
        <circle className="orbit-dot" cx="260" cy="75" r="3" fill="#527e96" />
      </svg>
      <div className="domain-center">
        <Cpu size={31} />
        <span>
          SYSTÈME
          <br />
          INTELLIGENT
        </span>
      </div>
      <div className="domain-node domain-top">
        <Code2 size={17} />
        <span>Ingénierie logicielle</span>
      </div>
      <div className="domain-node domain-right">
        <BrainCircuit size={17} />
        <span>Intelligence artificielle</span>
      </div>
      <div className="domain-node domain-bottom">
        <Cpu size={17} />
        <span>Systèmes embarqués</span>
      </div>
      <div className="domain-node domain-left">
        <Network size={17} />
        <span>Cloud & objets connectés</span>
      </div>
    </div>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | undefined;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !project) {
      dialog?.close();
      return;
    }
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog.showModal();
    document.dispatchEvent(new Event('portfolio:dialog'));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
      document.dispatchEvent(new Event('portfolio:dialog'));
      previousFocus?.focus({ preventScroll: true });
    };
  }, [project]);
  return (
    <dialog
      ref={ref}
      className="project-dialog glass glass--dialog"
      aria-labelledby="project-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      {project && (
        <>
          <div className="dialog-top glass glass--navigation">
            <span className="eyebrow">ÉTUDE DE CAS / {project.number}</span>
            <button
              className="icon-button"
              onClick={onClose}
              aria-label="Fermer l’étude de cas"
            >
              <X size={20} />
            </button>
          </div>
          <div className="dialog-content">
            <p className="project-category">{project.label}</p>
            <h2 id="project-dialog-title">{project.title}</h2>
            <p className="dialog-subtitle">{project.subtitle}</p>
            <div className="project-role">
              <span>MON RÔLE</span>
              <p>{project.role}</p>
            </div>
            <EngineeringDemo key={project.slug} type={project.visual} />
            <div className="tag-list">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <h3>Le contexte</h3>
            <p>{project.context}</p>
            <div className="decision-block glass">
              <span className="eyebrow">LE CHOIX TECHNIQUE</span>
              <p>{project.decision}</p>
            </div>
            <h3>Ma contribution</h3>
            <ul className="contribution-list">
              {project.contribution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="result-block glass">
              <p className="eyebrow">RÉSULTAT SUR LE TERRAIN</p>
              <p>{project.result}</p>
            </div>
            <p className="scope-note">{project.scope}</p>
            <div className="dialog-bottom">
              <span>
                <span className="status-dot muted" /> Code professionnel non
                public
              </span>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mon profil GitHub <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}

function Contact() {
  const [copied, setCopied] = useState('');
  const reduced = useReducedMotion();
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied('Adresse copiée dans le presse-papiers.');
    } catch {
      setCopied(
        'Copie indisponible. Vous pouvez sélectionner l’adresse ci-dessous.',
      );
    }
  };
  return (
    <section
      id="contact"
      className="contact-section section-anchor"
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== 'mouse') return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          '--cx',
          `${(event.clientX - rect.left - rect.width / 2) * 0.025}px`,
        );
        event.currentTarget.style.setProperty(
          '--cy',
          `${(event.clientY - rect.top - rect.height / 2) * 0.025}px`,
        );
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty('--cx', '0px');
        event.currentTarget.style.setProperty('--cy', '0px');
      }}
    >
      <div className="contact-art" aria-hidden="true" />
      <div className="container contact-content">
        <SectionLabel number="06">CONTACT</SectionLabel>
        <div className="contact-layout">
          <Reveal className="contact-panel glass glass--dark">
            <p className="availability">
              <span className="status-dot" />
              Disponible pour de nouvelles opportunités
            </p>
            <h2>
              Construisons des systèmes
              <br />
              <span>plus intelligents.</span>
            </h2>
            <p className="contact-description">
              Une application métier, une plateforme cloud ou un système de
              vision embarquée ? Parlons de ce que nous pouvons construire
              ensemble.
            </p>
            <div className="email-row">
              <a href={`mailto:${profile.email}`} className="email-link">
                {profile.email}
                <ArrowUpRight />
              </a>
              <button
                type="button"
                className="icon-button copy-button"
                onClick={copyEmail}
                aria-label="Copier l’adresse email"
              >
                {copied.startsWith('Adresse copiée') ? (
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
                )}
              </button>
            </div>
            <p className="copy-feedback" role="status">
              {copied}
            </p>
            <div className="contact-actions">
              <a
                className="social-link"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
                GitHub
                <ArrowUpRight size={13} />
              </a>
              <a
                className="social-link"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
                LinkedIn
                <ArrowUpRight size={13} />
              </a>
              <a
                className="social-link"
                href={profile.gitlab}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 size={18} />
                GitLab
                <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="contact-practical">
              <span>
                <MapPin size={14} />
                Caen · Mobilité en France
              </span>
              <a href="tel:+33788093591">+33 7 88 09 35 91</a>
            </div>
          </Reveal>
          <Reveal className="resume-reveal" delay={0.1}>
            <ResumeCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const selectedProject = projects.find((project) => project.slug === selected);
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      const prefix = hash.startsWith('projet/')
        ? 'projet/'
        : hash.startsWith('/projects/')
          ? '/projects/'
          : null;
      setSelected(prefix ? hash.slice(prefix.length) : null);
      // Preserve existing links from the previous portfolio.
      const aliases: Record<string, string> = {
        '/': 'accueil',
        '/projects': 'projets',
        projects: 'projets',
        '/about': 'a-propos',
        '/skills': 'expertise',
        '/experience': 'parcours',
        '/contact': 'contact',
        '/cv': 'contact',
        '/privacy': 'confidentialite',
        'wifi-observability': 'projets',
      };
      const target = aliases[hash];
      if (target) {
        history.replaceState(null, '', `#${target}`);
        document.getElementById(target)?.scrollIntoView();
      }
      if (hash === '/projects/wifi-observability') {
        history.replaceState(null, '', '#projet/mediaspot');
        setSelected('mediaspot');
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);
  const icons = {
    brain: BrainCircuit,
    chip: Cpu,
    code: Code2,
    network: Network,
  };
  const filtered = projects.filter(
    (project) => filter === 'all' || project.category === filter,
  );

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <section id="accueil" className="hero section-anchor">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                <span className="eyebrow-line" />
                ABDALLAH KASSAN / INGÉNIEUR UTT
              </p>
              <motion.h1 initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                <span>Ingénieur Logiciel.</span>
                <span>
                  Systèmes
                  <br className="medium-break" /> Intelligents.
                </span>
                <span className="accent-text">IA Embarquée.</span>
              </motion.h1>
              <p className="hero-specialties">
                Full Stack <span>/</span> Backend <span>/</span> Cloud{' '}
                <span>/</span> Edge AI
              </p>
              <p className="hero-description">
                Des interfaces React aux services AWS, jusqu’à la vision sur
                NVIDIA Jetson : je conçois, livre et maintiens des logiciels qui
                fonctionnent sur le terrain.
              </p>
              <div className="hero-actions">
                <MagneticLink href="#projets" className="button button-primary">
                  Explorer mes projets
                  <ArrowUpRight size={18} />
                </MagneticLink>
                <MagneticLink href="#contact" className="button button-quiet">
                  Me contacter
                  <ArrowRight size={16} />
                </MagneticLink>
              </div>
              <p className="availability">
                <span className="status-dot" />
                Disponible pour de nouvelles opportunités
              </p>
            </div>
            <CoreVisual suspended={Boolean(selectedProject)} />
            <div className="hero-bottom">
              <a href="#a-propos" className="scroll-link">
                <span className="scroll-icon">
                  <ArrowDown size={15} />
                </span>
                DÉCOUVRIR MON UNIVERS
              </a>
              <span className="hero-location">
                <MapPin size={13} />
                CAEN, FRANCE · MOBILITÉ FRANCE
              </span>
            </div>
          </div>
        </section>

        <section className="impact-section" aria-labelledby="impact-title">
          <div className="container">
            <div className="impact-heading">
              <h2 id="impact-title">L’ingénierie, à l’épreuve du réel.</h2>
              <span className="eyebrow">RÉALISATIONS CHEZ FASTPOINT</span>
            </div>
            <div className="impact-grid">
              {impact.map((item) => (
                <button
                  key={item.project}
                  className="impact-item glass glass--interactive"
                  type="button"
                  onClick={() => {
                    window.location.hash = `projet/${item.project}`;
                  }}
                  aria-label={`Découvrir : ${item.label}`}
                >
                  <span className="impact-value">
                    {item.value}
                    <span>{item.unit}</span>
                  </span>
                  <span className="impact-label">
                    {item.label}
                    <ArrowUpRight size={14} />
                  </span>
                  <span className="impact-detail">{item.detail}</span>
                </button>
              ))}
            </div>
            <p className="impact-footnote">
              ¹ Estimations et observations terrain. Périmètres et conditions
              précisés dans chaque étude de cas.
            </p>
          </div>
        </section>

        <section id="a-propos" className="section section-anchor about-section">
          <div className="container">
            <SectionLabel number="01">À PROPOS</SectionLabel>
            <div className="about-layout">
              <Reveal className="about-copy">
                <h2>
                  Créer l’intelligence.
                  <br />
                  <span className="muted-heading">Maîtriser le système.</span>
                </h2>
                <p className="about-intro">
                  Je suis <strong>Abdallah Kassan</strong>, ingénieur diplômé de
                  l’Université de Technologie de Troyes. Depuis septembre 2024,
                  je développe des produits logiciels chez Fastpoint, à Caen.
                </p>
                <p>
                  Mon travail relie les interfaces React/TypeScript, les API
                  Python et Node.js, le cloud AWS et la vision embarquée sur
                  NVIDIA Jetson. Je prends en charge le produit du besoin
                  utilisateur jusqu’aux tests, au déploiement et à la
                  maintenance.
                </p>
                <p>
                  Ce qui m’intéresse : rendre un système utile, compréhensible
                  et fiable. Une zone de détection que le client configure seul,
                  un bus supervisé à distance, une mise à jour qui peut revenir
                  en arrière.
                </p>
                <div className="about-signature">
                  <span className="signature-mark">ak.</span>
                  <div>
                    Abdallah Kassan<span>INGÉNIEUR LOGICIEL · DIPLÔMÉ UTT</span>
                  </div>
                </div>
              </Reveal>
              <Reveal
                className="about-visual glass glass--raised glass--optical"
                delay={0.1}
              >
                <DomainDiagram />
                <p className="diagram-caption">
                  UNE APPROCHE SYSTÈME, DE BOUT EN BOUT
                </p>
              </Reveal>
            </div>
            <div className="approach-grid">
              {approach.map((item) => (
                <div className="approach-item glass" key={item.number}>
                  <span>{item.number}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="expertise"
          className="section section-anchor expertise-section"
        >
          <div className="container">
            <SectionLabel number="02">EXPERTISE</SectionLabel>
            <Reveal className="section-heading-row">
              <h2>
                De l’algorithme
                <br />
                <span className="muted-heading">au monde réel.</span>
              </h2>
              <p>
                Quatre domaines complémentaires.
                <br />
                Une même exigence d’ingénierie.
              </p>
            </Reveal>
            <div className="expertise-grid">
              {expertise.map((item, i) => {
                const Icon = icons[item.icon as keyof typeof icons];
                return (
                  <Reveal
                    key={item.title}
                    className="expertise-card glass glass--dark"
                    delay={i * 0.05}
                  >
                    <div className="expertise-icon">
                      <Icon size={26} strokeWidth={1.3} />
                    </div>
                    <p className="eyebrow expertise-label">{item.label}</p>
                    <h3>{item.title}</h3>
                    <p className="expertise-description">{item.description}</p>
                    <ul>
                      {item.tags.map((tag) => (
                        <li key={tag}>
                          <span /> {tag}
                        </li>
                      ))}
                    </ul>
                    <span className="card-corner" aria-hidden="true">
                      +
                    </span>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="projets"
          className="section section-anchor projects-section"
        >
          <div className="container">
            <SectionLabel number="03">PROJETS SÉLECTIONNÉS</SectionLabel>
            <Reveal className="section-heading-row">
              <h2>
                Des idées aux
                <br />
                <span className="muted-heading">systèmes fonctionnels.</span>
              </h2>
              <p>
                Six réalisations, de l’interface à l’exploitation.
                <br />
                Mon rôle, mes choix et leurs effets sur le terrain.
              </p>
            </Reveal>
            <div
              className="project-filters"
              role="group"
              aria-label="Filtrer les projets"
            >
              {[
                ['all', 'Tous les projets'],
                ['vision', 'Vision & IA'],
                ['logiciel', 'Logiciel'],
                ['cloud', 'Cloud & systèmes'],
                ['operations', 'Données & exploitation'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {label}
                  {filter === value && <span className="filter-dot" />}
                </button>
              ))}
            </div>
            <p className="sr-only" role="status">
              {filtered.length} projets affichés
            </p>
            <div
              className={`projects-grid ${filter === 'all' ? 'curated-grid' : ''}`}
            >
              {filtered.map((project) => (
                <Reveal
                  key={project.slug}
                  className={`project-card glass ${project.visual === 'delivery' ? 'glass--dark' : 'glass--raised'} project-${project.visual}`}
                >
                  <div className="project-demonstration">
                    <EngineeringDemo type={project.visual} />
                  </div>
                  <div className="project-info">
                    <div className="project-meta">
                      <span className="project-category">{project.label}</span>
                      <span className="project-number">/{project.number}</span>
                    </div>
                    <button
                      type="button"
                      className="project-subtitle"
                      aria-label={`Voir le projet : ${project.subtitle}`}
                      onClick={() => {
                        window.location.hash = `projet/${project.slug}`;
                      }}
                    >
                      {project.subtitle}
                      <ArrowUpRight size={14} />
                    </button>
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-metric">
                      <strong>{project.metric.value}</strong>
                      <div>
                        <span>{project.metric.label}</span>
                        <p>{project.metric.note}</p>
                      </div>
                    </div>
                    <div className="tag-list">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <button
                      className="project-detail-link"
                      onClick={() => {
                        window.location.hash = `projet/${project.slug}`;
                      }}
                    >
                      Explorer l’étude de cas <ArrowUpRight size={17} />
                      <span className="sr-only"> : {project.subtitle}</span>
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="projects-note">
              <p>
                Projets professionnels réalisés chez Fastpoint ·
                2024–aujourd’hui.
                <br />
                Contributions, résultats et périmètre détaillés dans chaque
                étude de cas.
              </p>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={17} />
                Retrouvez-moi sur GitHub
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="technologies"
          className="section section-anchor technologies-section"
        >
          <div className="container">
            <SectionLabel number="04">TECHNOLOGIES</SectionLabel>
            <Reveal className="section-heading-row">
              <h2>
                Les outils derrière
                <br />
                <span className="muted-heading">l’intelligence.</span>
              </h2>
              <p>
                Des technologies mises en œuvre en production.
                <br />
                Chaque outil au service d’un besoin concret.
              </p>
            </Reveal>
            <div className="tech-grid">
              {technologies.map((category, i) => (
                <Reveal
                  className="tech-column glass"
                  key={category.label}
                  delay={i * 0.04}
                >
                  <p className="eyebrow">{category.label}</p>
                  <ul>
                    {category.items.map((item) => (
                      <li key={item}>
                        <span className="tech-symbol" aria-hidden="true">
                          {technologyMarks[item]}
                        </span>
                        {item}
                        <span className="tech-hover-line" />
                      </li>
                    ))}
                  </ul>
                  <p className="tech-note">{category.note}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="parcours"
          className="section section-anchor experience-section"
        >
          <div className="container">
            <SectionLabel number="05">PARCOURS</SectionLabel>
            <div className="experience-layout">
              <Reveal className="experience-intro">
                <h2>
                  Une progression
                  <br />
                  guidée par
                  <br />
                  <span className="muted-heading">l’ingénierie.</span>
                </h2>
                <p>
                  Apprendre, construire, confronter
                  <br />
                  les idées à la réalité.
                </p>
                <a
                  href={profile.cv}
                  download={profile.cvFilename}
                  className="text-link"
                >
                  Mon CV de référence
                  <Download size={16} />
                </a>
                <div className="education-note glass">
                  <BrainCircuit size={22} />
                  <div>
                    <strong>Continuer à apprendre.</strong>
                    <p>
                      Certificat professionnel et spécialisation TensorFlow sur
                      Coursera.
                    </p>
                  </div>
                </div>
                <div className="language-note glass">
                  <span className="eyebrow">LANGUES DE TRAVAIL</span>
                  <p>
                    Français <span>Professionnel</span>
                  </p>
                  <p>
                    Anglais <span>Professionnel</span>
                  </p>
                  <p>
                    Arabe <span>Langue maternelle</span>
                  </p>
                </div>
              </Reveal>
              <div className="timeline">
                {timeline.map((item) => (
                  <Reveal
                    className={`timeline-item glass ${item.current ? 'is-current' : ''}`}
                    key={item.organization}
                  >
                    <span className="timeline-dot" />
                    <p className="timeline-date">
                      {item.date}
                      {item.current && <span>ACTUEL</span>}
                    </p>
                    <h3>{item.title}</h3>
                    <p className="timeline-organization">{item.organization}</p>
                    <p className="timeline-location">{item.location}</p>
                    <p className="timeline-description">{item.description}</p>
                    {item.current && (
                      <div className="experience-evidence">
                        <span>React / TypeScript</span>
                        <span>Python / Node.js</span>
                        <span>AWS / Jetson</span>
                        <p>
                          Releases adaptées aux installations COLAS, IDEA et
                          SNCF. Diagnostic à distance, tests automatisés et
                          maintien en production.
                        </p>
                      </div>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-main">
          <a className="footer-brand" href="#accueil">
            ak<span>.</span>
          </a>
          <p>
            © {new Date().getFullYear()} Abdallah Kassan
            <span>Conçu avec précision. Construit avec passion.</span>
          </p>
          <a className="back-top" href="#accueil">
            Retour en haut
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="container footer-privacy">
          <details id="confidentialite">
            <summary>Confidentialité</summary>
            <p>
              Ce portfolio ne contient ni outil de mesure d’audience ni cookie
              publicitaire. Les polices sont hébergées avec le site. Les liens
              email ouvrent votre messagerie ; aucun message n’est envoyé par ce
              site. L’hébergement GitHub Pages et les sites externes disposent
              de leurs propres politiques de confidentialité.
            </p>
          </details>
          <span>LOGICIEL · INTELLIGENCE · EMBARQUÉ</span>
        </div>
      </footer>
      <ProjectDialog
        project={selectedProject}
        onClose={() => {
          window.location.hash = 'projets';
        }}
      />
    </MotionConfig>
  );
}
