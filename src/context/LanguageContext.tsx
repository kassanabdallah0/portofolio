import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
}

const translations = {
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Expérience',
    'nav.projects': 'Projects',
    'nav.certifications': 'Certifications',
    'nav.contact': 'Contact Me',

    // Hero
    'hero.available': 'Open to CDI Opportunities in France',
    'hero.title': 'Cloud Software Engineer',
    'hero.subtitle': 'AWS Cloud | Linux | Backend & Full-Stack',
    'hero.description':
      'Cloud Software Engineer focused on recent production software projects at Fastpoint: cloud services, backend delivery, reliability, and secure operations.',
    'hero.viewProjects': 'View Projects',
    'hero.getInTouch': 'Get in Touch',

    // Job Seeking Banner
    'jobSeeking.title': 'Seeking a CDI Position',
    'jobSeeking.subtitle': 'Cloud Software Engineering Focus',
    'jobSeeking.description':
      'I am currently looking for a permanent position (CDI) as a Cloud Software Engineer, with strong ownership of cloud architecture, backend services, CI/CD, monitoring, and secure production operations.',
    'jobSeeking.location': 'Based in Caen, France',
    'jobSeeking.mobility': 'Open to relocation',

    // About
    'about.badge': 'About Me',
    'about.title': 'Delivering Reliable',
    'about.subtitle': 'Cloud Software Systems',
    'about.p1':
      'I have 2 years of professional experience and 7 delivered projects, mainly focused on cloud software engineering at Fastpoint: API/backend development, AWS integration, Linux operations, and production reliability.',
    'about.p2':
      'My recent work combines software delivery and cloud operations: CI/CD automation, observability with ELK and CloudWatch, security hardening, and cost/performance optimization.',
    'about.stats.years': 'Years Expérience',
    'about.stats.projects': 'Projects Delivered',
    'about.stats.performance': 'Performance Gain (5 FPS -> 30 FPS)',
    'about.stats.cost': 'AWS Cost Reduction',
    'about.metrics.performanceDetail': '500% gain means moving from 5 FPS to 30 FPS on the Jetson vision pipeline.',
    'about.metrics.costDetail': '32% reduction comes from cloud architecture and query optimization on recent AWS projects.',

    // Skills
    'skills.badge': 'Technical Skills',
    'skills.title': 'Cloud Software',
    'skills.subtitle': 'Skills Matrix',
    'skills.description':
      'Core capabilities first, then the broader technical stack used to deliver production-ready cloud software.',
    'skills.keyTitle': 'Key Skills',
    'skills.keyDescription': 'Top strengths recruiters can scan quickly.',
    'skills.otherTitle': 'Other Skills',
    'skills.otherDescription': 'Complementary skills that support end-to-end delivery.',

    // Expérience
    'experience.badge': 'Work Expérience',
    'experience.title': 'Professional',
    'experience.subtitle': 'Journey',
    'experience.description':
      'Recent experience centered on Cloud Software Engineering: software delivery, cloud infrastructure, and production operations.',
    'experience.present': 'Present',
    'experience.achievements': 'Key Achievements',
    'experience.technologies': 'Technologies',

    // Projects
    'projects.badge': 'Recent Projects',
    'projects.title': 'Cloud Software',
    'projects.subtitle': 'Projects at Fastpoint',
    'projects.description':
      'Recent software and cloud projects delivered in production: reporting automation, platform reliability, secure operations, and edge integration.',
    'projects.highlights': 'Highlights',

    // Certifications
    'certifications.badge': 'Certifications & Education',
    'certifications.title': 'Credentials &',
    'certifications.subtitle': 'Learning',
    'certifications.certifications': 'Certifications',
    'certifications.education': 'Education',
    'certifications.languages': 'Languages',
    'certifications.fluent': 'Fluent',
    'certifications.native': 'Native',

    // Contact
    'contact.badge': 'Get in Touch',
    'contact.title': "Let's",
    'contact.subtitle': 'Connect',
    'contact.description':
      'Open to Cloud Software Engineer opportunities in software delivery, cloud infrastructure, and platform reliability. Based in Caen, France and available across the country.',
    'contact.downloadCV': 'Download CV',

    // Footer
    'footer.rights': 'All rights reserved.',

    // Theme
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',

    // Language
    'language.en': 'English',
    'language.fr': 'Français',
  },
  fr: {
    // Navigation
    'nav.about': 'À propos',
    'nav.skills': 'Compétences',
    'nav.experience': 'Expérience',
    'nav.projects': 'Projets',
    'nav.certifications': 'Certifications',
    'nav.contact': 'Me contacter',

    // Hero
    'hero.available': 'Ouvert aux opportunités CDI en France',
    'hero.title': 'Ingénieur Logiciel Cloud',
    'hero.subtitle': 'Cloud AWS | Linux | Backend et Full-Stack',
    'hero.description':
      'Ingénieur Logiciel Cloud oriente vers des projets logiciels recents en production chez Fastpoint : services cloud, backend, fiabilité et sécurisation des operations.',
    'hero.viewProjects': 'Voir les projets',
    'hero.getInTouch': 'Me contacter',

    // Job Seeking Banner
    'jobSeeking.title': "A la recherche d'un poste en CDI",
    'jobSeeking.subtitle': 'Orientation Ingénieur Logiciel Cloud',
    'jobSeeking.description':
      "Je recherche actuellement un poste en CDI en tant qu'Ingénieur Logiciel Cloud, avec une forte responsabilité sur l'architecture cloud, les services backend, le CI/CD, la supervision et la sécurisation de la production.",
    'jobSeeking.location': 'Basé à Caen, France',
    'jobSeeking.mobility': 'Ouvert a la mobilité',

    // About
    'about.badge': 'À propos',
    'about.title': 'Concevoir des',
    'about.subtitle': 'Systèmes Cloud Fiables',
    'about.p1':
      "J'ai 2 ans d'experience professionnelle et 7 projets livres, principalement axes sur l'ingenierie logicielle cloud chez Fastpoint : developpement API/backend, integration AWS, operations Linux et fiabilité en production.",
    'about.p2':
      "Mes travaux recents combinent livraison logicielle et operations cloud : automatisation CI/CD, observabilite avec ELK et CloudWatch, sécurisation des acces, et optimisation cout/performance.",
    'about.stats.years': "Années d'expérience",
    'about.stats.projects': 'Projets livrés',
    'about.stats.performance': 'Gain de performance (5 FPS -> 30 FPS)',
    'about.stats.cost': 'Réduction des coûts AWS',
    'about.metrics.performanceDetail': "Le gain de 500% correspond au passage de 5 FPS à 30 FPS sur le pipeline vision Jetson.",
    'about.metrics.costDetail': "La réduction de 32% vient d'optimisations d'architecture cloud et de requêtes sur des projets AWS récents.",

    // Skills
    'skills.badge': 'Compétences Techniques',
    'skills.title': 'Compétences',
    'skills.subtitle': 'Logiciel Cloud',
    'skills.description':
      "D'abord les compétences clés, puis le reste du stack technique utilisé pour livrer des logiciels cloud en production.",
    'skills.keyTitle': 'Compétences clés',
    'skills.keyDescription': 'Points forts visibles en quelques secondes.',
    'skills.otherTitle': 'Autres compétences',
    'skills.otherDescription': 'Compétences complementaires pour une livraison end-to-end.',

    // Expérience
    'experience.badge': 'Expérience Professionnelle',
    'experience.title': 'Parcours',
    'experience.subtitle': 'Professionnel',
    'experience.description':
      "Expérience recente centree sur l'ingenierie logicielle cloud : livraison software, infrastructure cloud et exploitation production.",
    'experience.present': 'Present',
    'experience.achievements': 'Réalisations clés',
    'experience.technologies': 'Technologies',

    // Projects
    'projects.badge': 'Projets Récents',
    'projects.title': 'Projets Logiciels',
    'projects.subtitle': 'Cloud chez Fastpoint',
    'projects.description':
      'Projets logiciels et cloud recents livres en production : automatisation de reporting, fiabilité plateforme, sécurisation des operations et integration edge.',
    'projects.highlights': 'Points forts',

    // Certifications
    'certifications.badge': 'Certifications et Formation',
    'certifications.title': 'Diplômes et',
    'certifications.subtitle': 'Formation',
    'certifications.certifications': 'Certifications',
    'certifications.education': 'Formation',
    'certifications.languages': 'Langues',
    'certifications.fluent': 'Courant',
    'certifications.native': 'Maternelle',

    // Contact
    'contact.badge': 'Me contacter',
    'contact.title': 'Restons en',
    'contact.subtitle': 'Contact',
    'contact.description':
      "Ouvert aux opportunités d'Ingénieur Logiciel Cloud en livraison software, infrastructure cloud et fiabilité plateforme. Basé à Caen, France et mobile sur tout le territoire.",
    'contact.downloadCV': 'Télécharger CV',

    // Footer
    'footer.rights': 'Tous droits réservés.',

    // Theme
    'theme.light': 'Mode clair',
    'theme.dark': 'Mode sombre',

    // Language
    'language.en': 'English',
    'language.fr': 'Français',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'fr';
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en' || savedLanguage === 'fr') {
      return savedLanguage;
    }

    return 'fr';
  });

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'fr' : 'en'));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback(
    (key: string): string | string[] => {
      const translation = translations[language];
      if (key in translation) {
        return translation[key as keyof typeof translation];
      }
      return key;
    },
    [language],
  );

  return <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

