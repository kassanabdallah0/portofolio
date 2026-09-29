import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { PreferencesProvider, usePreferences } from '@/context/preferences';
import { useRoute } from '@/lib/router';
import { projects } from '@/data/portfolio';
import { Navigation, Footer } from '@/components/Site';
import {
  HomePage,
  ProjectsPage,
  ProjectPage,
  ExperiencePage,
  SkillsPage,
  AboutPage,
  CVPage,
  ContactPage,
  PrivacyPage,
  NotFoundPage,
} from '@/pages/Pages';

function Portfolio() {
  const path = useRoute();
  const { language } = usePreferences();
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(path);
  const project = projects.find((item) => path === `/projects/${item.slug}`);
  const titles: Record<string, [string, string]> = {
    '/': [
      'Développeur Full Stack — React, Python, Node.js',
      'Full Stack Developer — React, Python, Node.js',
    ],
    '/projects': ['Projets', 'Projects'],
    '/experience': ['Parcours', 'Experience'],
    '/skills': ['Compétences', 'Skills'],
    '/about': ['À propos', 'About'],
    '/cv': ['CV', 'Resume'],
    '/contact': ['Contact', 'Contact'],
    '/privacy': ['Confidentialité', 'Privacy'],
  };
  const title =
    project?.name[language] ||
    titles[path]?.[language === 'fr' ? 0 : 1] ||
    '404';
  useEffect(() => {
    document.title = `${title} | Abdallah Kassan`;
    const description =
      project?.summary[language] ||
      (language === 'fr'
        ? 'Abdallah Kassan, développeur Full Stack junior : React/TypeScript, Python, Node.js et AWS. Projets web et vision embarquée. Recherche CDI, mobilité France entière.'
        : 'Abdallah Kassan, junior Full Stack Developer: React/TypeScript, Python, Node.js and AWS. Web and edge vision projects. Seeking a permanent role across France.');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description);
    if (previousPath.current !== path) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      main.current?.focus({ preventScroll: true });
      previousPath.current = path;
    }
  }, [path, title, language, project]);
  const pages: Record<string, ReactNode> = {
    '/': <HomePage />,
    '/projects': <ProjectsPage />,
    '/experience': <ExperiencePage />,
    '/skills': <SkillsPage />,
    '/about': <AboutPage />,
    '/cv': <CVPage />,
    '/contact': <ContactPage />,
    '/privacy': <PrivacyPage />,
  };
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        {language === 'fr' ? 'Aller au contenu' : 'Skip to content'}
      </a>
      <Navigation key={path} path={path} />
      <main id="main-content" className="container" ref={main} tabIndex={-1}>
        {project ? (
          <ProjectPage key={project.slug} project={project} />
        ) : (
          <div key={path}>{pages[path] || <NotFoundPage />}</div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <Portfolio />
    </PreferencesProvider>
  );
}
