import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpRight,
  Github,
  GitBranch,
  Globe2,
  Linkedin,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { usePreferences } from '@/context/preferences';
import { profile } from '@/data/portfolio';

const navigation = [
  { path: '/', fr: 'Accueil', en: 'Home' },
  { path: '/projects', fr: 'Projets', en: 'Projects' },
  { path: '/experience', fr: 'Parcours', en: 'Experience' },
  { path: '/skills', fr: 'Compétences', en: 'Skills' },
  { path: '/about', fr: 'À propos', en: 'About' },
];

export function Navigation({ path }: { path: string }) {
  const { language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const [open, setOpen] = useState(false);
  const fr = language === 'fr';
  const links = [
    ...navigation,
    { path: '/cv', fr: 'CV', en: 'Resume' },
    { path: '/contact', fr: 'Contact', en: 'Contact' },
  ];
  return (
    <header className="site-header">
      <div className="nav-inner">
        <a
          href="#/"
          className="brand"
          aria-label={
            fr ? 'Abdallah Kassan — accueil' : 'Abdallah Kassan — home'
          }
        >
          <span className="monogram">
            ak<span>.</span>
          </span>
          <span className="brand-name">Abdallah Kassan</span>
        </a>
        <nav
          className="desktop-nav"
          aria-label={fr ? 'Navigation principale' : 'Main navigation'}
        >
          {navigation.slice(1).map((item) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              aria-current={
                path === item.path || path.startsWith(`${item.path}/`)
                  ? 'page'
                  : undefined
              }
            >
              {item[language]}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="icon-button language-button"
            onClick={toggleLanguage}
            aria-label={fr ? 'Switch to English' : 'Passer en français'}
          >
            <Globe2 size={16} aria-hidden="true" />
            <span>{language.toUpperCase()}</span>
          </button>
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={
              fr
                ? `Activer le mode ${theme === 'light' ? 'sombre' : 'clair'}`
                : `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
            }
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a className="button small nav-contact" href="#/contact">
            Contact <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button
            className="icon-button menu-toggle"
            aria-label={
              fr
                ? open
                  ? 'Fermer le menu'
                  : 'Ouvrir le menu'
                : open
                  ? 'Close menu'
                  : 'Open menu'
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label={fr ? 'Navigation mobile' : 'Mobile navigation'}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false);
              document
                .querySelector<HTMLButtonElement>('.menu-toggle')
                ?.focus();
            }
          }}
        >
          {links.map((item) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              onClick={() => setOpen(false)}
              aria-current={path === item.path ? 'page' : undefined}
            >
              {item[language]}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h1>{title}</h1>
      {children && <p className="lede">{children}</p>}
    </div>
  );
}

export function CVLink({ secondary = false }: { secondary?: boolean }) {
  const { language } = usePreferences();
  return (
    <a
      className={`button ${secondary ? 'secondary' : ''}`}
      href={`${import.meta.env.BASE_URL}bucket/abdallah.kassan.pdf`}
      download="CV_Abdallah_Kassan.pdf"
    >
      <ArrowDownToLine size={17} aria-hidden="true" />
      {language === 'fr' ? 'Télécharger mon CV' : 'Download resume (FR)'}
    </a>
  );
}

export function ContactCTA() {
  const { language } = usePreferences();
  const fr = language === 'fr';
  return (
    <section className="contact-cta">
      <div>
        <p className="eyebrow">
          {fr ? 'La suite, ensemble' : 'What comes next'}
        </p>
        <h2>
          {fr
            ? 'Un projet, une équipe, un CDI.'
            : 'A product. A team. A permanent role.'}
        </h2>
        <p>
          {fr
            ? 'Basé à Caen, mobile dans toute la France.'
            : 'Based in Caen. Open to relocation across France.'}
        </p>
      </div>
      <a className="button" href="#/contact">
        {fr ? 'Parlons de votre équipe' : 'Tell me about your team'}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </section>
  );
}

export function Footer() {
  const { language } = usePreferences();
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <a className="brand" href="#/">
          <span className="monogram">
            ak<span>.</span>
          </span>
          <span>
            Abdallah Kassan
            <br />
            <small>React · Python · Node.js</small>
          </span>
        </a>
        <div className="footer-links">
          <a href="#/cv">{language === 'fr' ? 'Mon CV' : 'Resume'}</a>
          <a href="#/contact">Contact</a>
          <a href="#/privacy">
            {language === 'fr' ? 'Confidentialité' : 'Privacy'}
          </a>
        </div>
        <div className="social-links">
          {[
            { Icon: Github, href: profile.github, label: 'GitHub' },
            { Icon: GitBranch, href: profile.gitlab, label: 'GitLab' },
            { Icon: Linkedin, href: profile.linkedin, label: 'LinkedIn' },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} (${language === 'fr' ? 'nouvel onglet' : 'new tab'})`}
            >
              <Icon size={20} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Abdallah Kassan</span>
        <span>
          {language === 'fr'
            ? 'Développement web · Cloud · Vision embarquée'
            : 'Web development · Cloud · Edge vision'}
        </span>
      </div>
    </footer>
  );
}
