import { useEffect, useState } from 'react';
import { 
  Brain, 
  Code2, 
  Database, 
  Server, 
  Cpu, 
  Eye, 
  Layers, 
  Github,
  GitBranch, 
  Terminal,
  Mail,
  Linkedin,
  Phone,
  MapPin,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Zap,
  Workflow,
  Award,
  Globe,
  Sun,
  Moon,
  Briefcase,
  Search,
  CheckCircle2,
  Cloud,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

// Particle Background Component
const ParticleBackground = () => {
  return (
    <div className="particles">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            background: i % 3 === 0 ? 'rgba(249, 115, 22, 0.45)' : i % 3 === 1 ? 'rgba(20, 184, 166, 0.45)' : 'rgba(2, 132, 199, 0.4)',
          }}
        />
      ))}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      title={theme === 'dark' ? t('theme.light') as string : t('theme.dark') as string}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-orange-600" />
      )}
    </button>
  );
};

// Language Switcher Component
const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher"
    >
      <Globe className="w-4 h-4" />
      <span>{language === 'en' ? 'EN' : 'FR'}</span>
    </button>
  );
};

// Navigation Component
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = ['about', 'skills', 'experience', 'projects', 'certifications'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="text-xl font-bold gradient-text">Kassan Abdallah</div>
        
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group"
            >
              {t(`nav.${item}`) as string}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-teal-500 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button 
            onClick={() => scrollTo('contact')}
            className="bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-500 hover:to-teal-500 text-white border-0"
          >
            {t('nav.contact') as string}
          </Button>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const { t } = useLanguage();
  const fullText = t('hero.title') as string;
  
  useEffect(() => {
    let index = 0;
    setTypedText('');
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [fullText]);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden neural-bg">
      <ParticleBackground />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pulse-glow" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 fade-in-up">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-[var(--text-secondary)]">{t('hero.available') as string}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 fade-in-up stagger-1">
          <span className="gradient-text">Kassan Abdallah</span>
        </h1>
        
        <div className="text-xl md:text-3xl text-[var(--text-secondary)] mb-4 h-12 fade-in-up stagger-2">
          {typedText}
          <span className="typewriter-cursor" />
        </div>
        
        <p className="text-lg md:text-xl text-[var(--text-primary)] font-medium mb-4 fade-in-up stagger-3">
          {t('hero.subtitle') as string}
        </p>
        
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 fade-in-up stagger-4">
          {t('hero.description') as string}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 fade-in-up stagger-5">
          <Button 
            size="lg"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-shine bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-500 hover:to-teal-500 text-white border-0 px-8"
          >
            <Zap className="w-5 h-5 mr-2" />
            {t('hero.viewProjects') as string}
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] px-8"
          >
            <Mail className="w-5 h-5 mr-2" />
            {t('hero.getInTouch') as string}
          </Button>
        </div>
        
        <div className="mt-20 fade-in-up stagger-5">
          <button 
            onClick={scrollToAbout}
            className="animate-bounce text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Job Seeking Banner Section
const JobSeekingSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="job-seeking-banner rounded-3xl p-8 md:p-12 reveal">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-600 to-teal-600 flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                    {t('jobSeeking.title') as string}
                  </h2>
                  <p className="text-orange-500">{t('jobSeeking.subtitle') as string}</p>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">
                {t('jobSeeking.description') as string}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {t('jobSeeking.location') as string}
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Briefcase className="w-4 h-4 text-teal-500" />
                  {t('jobSeeking.mobility') as string}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-shine bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-500 hover:to-teal-500 text-white border-0"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t('nav.contact') as string}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  const { t } = useLanguage();
  
  const stats = [
    { value: '2', label: t('about.stats.years') as string },
    { value: '7', label: t('about.stats.projects') as string },
    { value: '500%', label: t('about.stats.performance') as string },
    { value: '32%', label: t('about.stats.cost') as string },
  ];

  return (
    <section id="about" className="py-24 relative grid-pattern">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <Badge className="mb-4 bg-orange-500/20 text-orange-500 border-orange-500/30">
              <Brain className="w-4 h-4 mr-1" />
              {t('about.badge') as string}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              {t('about.title') as string}{' '}
              <span className="gradient-text">{t('about.subtitle') as string}</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
              {t('about.p1') as string}
            </p>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
              {t('about.p2') as string}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-2 text-sm text-[var(--text-secondary)]">
              <p>{t('about.metrics.performanceDetail') as string}</p>
              <p>{t('about.metrics.costDetail') as string}</p>
            </div>
          </div>
          
          <div className="relative reveal">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-teal-600/20 rounded-3xl blur-2xl" />
            <div className="relative glass rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="glass rounded-2xl p-6 skill-card">
                    <Cloud className="w-10 h-10 text-orange-500 mb-3" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Cloud AWS</h3>
                    <p className="text-sm text-[var(--text-secondary)]">EC2, Lambda, S3, DynamoDB</p>
                  </div>
                  <div className="glass rounded-2xl p-6 skill-card">
                    <Eye className="w-10 h-10 text-teal-500 mb-3" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Computer Vision</h3>
                    <p className="text-sm text-[var(--text-secondary)]">YOLO, PyTorch, TensorRT</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="glass rounded-2xl p-6 skill-card">
                    <Server className="w-10 h-10 text-emerald-500 mb-3" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Full-Stack</h3>
                    <p className="text-sm text-[var(--text-secondary)]">React, Node.js, Python</p>
                  </div>
                  <div className="glass rounded-2xl p-6 skill-card">
                    <Cpu className="w-10 h-10 text-amber-500 mb-3" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Edge AI</h3>
                    <p className="text-sm text-[var(--text-secondary)]">NVIDIA Jetson</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Skills Section
const SkillsSection = () => {
  const { language, t } = useLanguage();

  const keySkills = [
    {
      title: 'Cloud Architecture',
      titleFr: 'Architecture Cloud',
      focus:
        language === 'fr'
          ? 'Services AWS robustes et scalables.'
          : 'Scalable and reliable AWS services.',
      icon: Cloud,
      color: 'teal',
      stack: ['AWS', 'Lambda', 'API Gateway'],
    },
    {
      title: 'Backend Delivery',
      titleFr: 'Livraison Backend',
      focus:
        language === 'fr'
          ? 'APIs maintenables en Node.js/TypeScript.'
          : 'Maintainable APIs with Node.js/TypeScript.',
      icon: Server,
      color: 'orange',
      stack: ['Node.js', 'TypeScript', 'REST API'],
    },
    {
      title: 'CI/CD & Releases',
      titleFr: 'CI/CD et Releases',
      focus:
        language === 'fr'
          ? 'Deploiements stables et automatises.'
          : 'Stable and automated production releases.',
      icon: Workflow,
      color: 'sky',
      stack: ['GitLab CI/CD', 'Docker', 'Nginx'],
    },
    {
      title: 'Observability',
      titleFr: 'Observabilite',
      focus:
        language === 'fr'
          ? 'Monitoring clair et alerting actionnable.'
          : 'Clear monitoring and actionable alerting.',
      icon: Eye,
      color: 'emerald',
      stack: ['ELK', 'CloudWatch', 'Logs Insights'],
    },
  ];

  const otherSkillCategories = [
    {
      title: 'Full-Stack Development',
      titleFr: 'Développement Full-Stack',
      icon: Code2,
      color: 'orange',
      skills: ['React', 'JavaScript/TypeScript', 'Node.js', 'Express.js', 'Python', 'Flask API', 'REST API']
    },
    {
      title: 'Databases',
      titleFr: 'Bases de Données',
      icon: Database,
      color: 'teal',
      skills: ['SQL', 'MySQL', 'MongoDB', 'DynamoDB', 'PostgreSQL']
    },
    {
      title: 'AI / Vision / IoT',
      titleFr: 'IA / Vision / IoT',
      icon: Eye,
      color: 'emerald',
      skills: ['YOLO (Ultralytics)', 'PyTorch', 'TensorRT', 'OpenCV', 'NVIDIA Jetson']
    },
    {
      title: 'Operations & Security',
      titleFr: 'Exploitation & Sécurité',
      icon: Shield,
      color: 'amber',
      skills: ['ELK Stack', 'CloudWatch', 'KPIs', 'Linux', 'OpenVPN', 'OpenSSL', 'Teltonika Routers']
    },
    {
      title: 'Cloud & CI/CD',
      titleFr: 'Cloud & CI/CD',
      icon: Cloud,
      color: 'sky',
      skills: ['AWS', 'Git', 'GitLab CI/CD', 'Docker', 'Nginx', 'API Gateway', 'SNS']
    },
    {
      title: 'Methodology',
      titleFr: 'Méthodologie',
      icon: CheckCircle2,
      color: 'slate',
      skills: ['Autonomy', 'Adaptability', 'Team Collaboration', 'Leadership', 'Product/Tech Teams']
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    orange: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-500',
      border: 'border-orange-500/30',
      gradient: 'from-orange-500 to-amber-500',
    },
    teal: {
      bg: 'bg-teal-500/20',
      text: 'text-teal-500',
      border: 'border-teal-500/30',
      gradient: 'from-teal-500 to-cyan-500',
    },
    emerald: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-500',
      border: 'border-emerald-500/30',
      gradient: 'from-emerald-500 to-teal-500',
    },
    amber: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-500',
      border: 'border-amber-500/30',
      gradient: 'from-amber-500 to-orange-500',
    },
    sky: {
      bg: 'bg-sky-500/20',
      text: 'text-sky-500',
      border: 'border-sky-500/30',
      gradient: 'from-sky-500 to-blue-500',
    },
    slate: {
      bg: 'bg-slate-500/20',
      text: 'text-slate-500',
      border: 'border-slate-500/30',
      gradient: 'from-slate-500 to-zinc-500',
    },
  };

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 bg-teal-500/20 text-teal-500 border-teal-500/30">
            <Layers className="w-4 h-4 mr-1" />
            {t('skills.badge') as string}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            {t('skills.title') as string}{' '}
            <span className="gradient-text">{t('skills.subtitle') as string}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            {t('skills.description') as string}
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('skills.keyTitle') as string}</h3>
          <p className="text-[var(--text-secondary)] mb-6">{t('skills.keyDescription') as string}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keySkills.map((skill, i) => {
              const colors = colorMap[skill.color] ?? colorMap.slate;
              const Icon = skill.icon;
              return (
                <div
                  key={i}
                  className="relative glass rounded-xl p-4 skill-card overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 w-full h-0.5 bg-gradient-to-r ${colors.gradient}`} />
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colors.bg} ${colors.text} mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                    {language === 'fr' ? skill.titleFr : skill.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">{skill.focus}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.stack.map((item, j) => (
                      <span key={j} className={`px-2 py-0.5 rounded-md text-[11px] ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-left mb-6">
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('skills.otherTitle') as string}</h3>
          <p className="text-[var(--text-secondary)]">{t('skills.otherDescription') as string}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherSkillCategories.map((category, i) => {
            const colors = colorMap[category.color] ?? colorMap.slate;
            const Icon = category.icon;
            return (
              <div 
                key={i} 
                className="glass rounded-2xl p-6 skill-card reveal"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.text} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                  {language === 'fr' ? category.titleFr : category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, j) => (
                    <span 
                      key={j}
                      className={`px-3 py-1 rounded-full text-sm ${colors.bg} ${colors.text} border ${colors.border}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Experience Section
const ExperienceSection = () => {
  const { language, t } = useLanguage();
  
  const experiences = [
    {
      company: 'Fastpoint',
      role: language === 'en' ? 'Cloud Software Engineer (AWS / Linux / Web)' : 'Ingénieur Logiciel Cloud (AWS / Linux / Web)',
      type: 'CDI',
      location: 'Caen, France',
      period: '09/2024 - Present',
      description: language === 'en' 
        ? 'Development and maintenance of production solutions: React, Node.js/TypeScript, Python/Flask, REST API, AWS.'
        : 'Développement et maintenance de solutions en production : React, Node.js/TypeScript, Python/Flask, API REST, AWS.',
      achievements: language === 'en' ? [
        'Integrated and stabilized computer vision pipeline on NVIDIA Jetson: detection models, real-time processing, API exposure',
        'Set up and maintained GitLab CI/CD pipelines',
        'Monitoring and operations: ELK + CloudWatch (logs, alerts, KPIs)',
        'Secured access: OpenVPN, OpenSSL (certificates), Nginx, firewall'
      ] : [
        'Intégration et stabilisation d\'un pipeline de vision sur NVIDIA Jetson : modèles de détection, traitement temps réel, API',
        'Mise en place et maintien des pipelines GitLab CI/CD',
        'Supervision et exploitation : ELK + CloudWatch (logs, alertes, KPIs)',
        'Sécurisation des accès : OpenVPN, OpenSSL (certificats), Nginx, firewall'
      ],
      technologies: ['React', 'Node.js', 'Python', 'Flask', 'AWS', 'Docker', 'GitLab CI/CD', 'ELK', 'NVIDIA Jetson']
    },
    {
      company: 'Keos Telecom',
      role: language === 'en' ? 'Full-Stack Developer - PHP / MySQL' : 'Développeur FullStack - PHP / MySQL',
      type: language === 'en' ? 'Internship (6 months)' : 'Stage (6 mois)',
      location: 'Paris, France',
      period: '07/2023 - 01/2024',
      description: language === 'en'
        ? 'Development and maintenance of a web application in PHP with MySQL database.'
        : 'Développement et maintenance d\'une application web en PHP avec base MySQL.',
      achievements: language === 'en' ? [
        'Implemented functional evolutions, bug fixes and SQL queries',
        'Participated in documentation and team collaboration'
      ] : [
        'Réalisé des évolutions fonctionnelles, correctifs et requêtes SQL',
        'Participation à la documentation et collaboration en équipe'
      ],
      technologies: ['PHP', 'MySQL', 'SQL', 'Web Development']
    },
    {
      company: 'HMRexpert',
      role: language === 'en' ? 'Full-Stack Developer - OpenCV' : 'Développeur Full Stack - OpenCV',
      type: language === 'en' ? 'Internship (6 months)' : 'Stage (6 mois)',
      location: language === 'en' ? 'Bourgogne-Franche-Comté, France' : 'Bourgogne-Franche-Comté',
      period: '02/2022 - 07/2022',
      description: language === 'en'
        ? 'Development under Linux (Qt) and OpenCV image processing modules.'
        : 'Développement sous Linux (Qt) et modules de traitement d\'image OpenCV.',
      achievements: language === 'en' ? [
        'Computer Vision pipeline for analyzing vehicle print images',
        'Integration, validation and technical documentation'
      ] : [
        'Pipeline Computer Vision pour analyser des images d\'impressions sur véhicules',
        'Intégration, validation et documentation technique'
      ],
      technologies: ['OpenCV', 'Linux', 'Qt', 'Python', 'C/C++']
    }
  ];

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
            <Workflow className="w-4 h-4 mr-1" />
            {t('experience.badge') as string}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            {t('experience.title') as string}{' '}
            <span className="gradient-text">{t('experience.subtitle') as string}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            {t('experience.description') as string}
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 timeline-line transform md:-translate-x-1/2" />
          
          {experiences.map((exp, i) => (
            <div 
              key={i} 
              className={`relative flex flex-col md:flex-row gap-8 mb-12 reveal ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full transform -translate-x-1/2 border-4 border-[var(--bg-primary)] z-10" />
              
              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="glass rounded-2xl p-6 project-card">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                      {exp.period}
                    </Badge>
                    <Badge variant="outline" className="border-[var(--border-color)] text-[var(--text-secondary)]">
                      <MapPin className="w-3 h-3 mr-1" />
                      {exp.location}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{exp.role}</h3>
                  <p className="text-orange-500 font-medium mb-3">{exp.company} • {exp.type}</p>
                  <p className="text-[var(--text-secondary)] mb-4">{exp.description}</p>
                  
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{t('experience.achievements') as string}</p>
                  <ul className="space-y-2 mb-4">
                    {exp.achievements.map((achievement, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{t('experience.technologies') as string}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, j) => (
                      <span 
                        key={j}
                        className="px-2 py-1 rounded-md text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Projects Section
const ProjectsSection = () => {
  const { language, t } = useLanguage();
  
  const projects = [
    {
      title: language === 'en' ? 'Monthly Router Reporting' : 'Reporting Mensuel Routeurs',
      subtitle: language === 'en' ? 'AWS Lambda & CloudWatch' : 'AWS Lambda & CloudWatch',
      period: '05/2025 - 09/2025',
      description: language === 'en'
        ? 'Designed a monthly reporting system for 70 buses with automated data extraction and cost optimization.'
        : 'Conception d\'un système de reporting mensuel pour 70 bus avec extraction automatisée des données et optimisation des coûts.',
      highlights: language === 'en' ? [
        'Designed monthly reporting system (connections, usage, statistics) with scheduled Lambda automation (70 buses)',
        'Industrialized Logs Insights queries and prepared data for monthly reports',
        'Achieved 32% cost reduction on AWS bill through architecture adjustments'
      ] : [
        'Conception d\'un système de reporting mensuel (connexions, usage, statistiques) avec automatisation Lambda planifiée (70 bus)',
        'Industrialisation des requêtes Logs Insights et préparation des données pour rapports mensuels',
        'Réduction de 32% sur la facture AWS grâce aux ajustements d\'architecture'
      ],
      technologies: ['AWS Lambda', 'CloudWatch', 'Logs Insights', 'DynamoDB', 'S3', 'API Gateway'],
      color: 'from-teal-600 to-sky-600',
      icon: Cloud
    },
    {
      title: language === 'en' ? 'CI/CD and Release Automation' : 'Automatisation CI/CD et Releases',
      subtitle: language === 'en' ? 'GitLab Pipelines for Cloud Software' : 'Pipelines GitLab pour logiciels cloud',
      period: '2024 - 2025',
      description: language === 'en'
        ? 'Implemented and maintained CI/CD pipelines to standardize builds, deployments, and release quality for production services.'
        : 'Mise en place et maintien de pipelines CI/CD pour standardiser les builds, les deploiements et la qualite des releases en production.',
      highlights: language === 'en' ? [
        'Built reusable GitLab pipeline stages for test/build/deploy workflows',
        'Reduced manual deployment steps and improved release consistency',
        'Improved collaboration between software and operations teams'
      ] : [
        'Construction de stages GitLab reutilisables pour les workflows test/build/deploy',
        'Reduction des manipulations manuelles et meilleure regularite des mises en production',
        'Meilleure coordination entre equipes software et operations'
      ],
      technologies: ['GitLab CI/CD', 'Docker', 'Nginx', 'Node.js', 'Linux'],
      color: 'from-orange-600 to-amber-600',
      icon: GitBranch
    },
    {
      title: language === 'en' ? 'Platform Observability and Alerting' : 'Observabilite et Alerting Plateforme',
      subtitle: language === 'en' ? 'ELK + CloudWatch Operations' : 'Operations ELK + CloudWatch',
      period: '2024 - 2025',
      description: language === 'en'
        ? 'Strengthened production monitoring and incident visibility for cloud services and connected infrastructure.'
        : 'Renforcement de la supervision de production et de la visibilite incident pour les services cloud et l\'infrastructure connectee.',
      highlights: language === 'en' ? [
        'Structured logs, dashboards, and alerts across ELK and CloudWatch',
        'Improved incident response with clearer operational KPIs',
        'Contributed to reducing recurring alerts and operational noise'
      ] : [
        'Structuration des logs, dashboards et alertes sur ELK et CloudWatch',
        'Amelioration de la reactivite incident via des KPIs operationnels clairs',
        'Contribution a la reduction des alertes recurrentes et du bruit operationnel'
      ],
      technologies: ['ELK Stack', 'CloudWatch', 'Logs Insights', 'KPIs', 'Linux'],
      color: 'from-sky-600 to-teal-600',
      icon: Workflow
    },
    {
      title: language === 'en' ? 'Free WiFi Deployment' : 'Déploiement Free WiFi',
      subtitle: language === 'en' ? 'Cloud Infrastructure & IoT' : 'Infrastructure Cloud & IoT',
      period: '2024',
      description: language === 'en'
        ? 'Deployed Free WiFi solution in buses: transformation to cloud-operational solution for 70 buses with centralized reporting.'
        : 'Déploiement de solution Free WiFi dans les bus : transformation vers une solution cloud opérationnelle pour 70 bus avec reporting centralisé.',
      highlights: language === 'en' ? [
        'Deployed Free WiFi solution for 70 buses with cloud transformation',
        'Centralized reporting and monitoring infrastructure',
        'Reduced approximately 40% of recurring errors/alerts via ELK analysis and targeted fixes'
      ] : [
        'Déploiement de solution Free WiFi pour 70 bus avec transformation cloud',
        'Infrastructure de reporting et supervision centralisés',
        'Réduction d\'environ 40% des erreurs/alertes récurrentes via analyse ELK et correctifs ciblés'
      ],
      technologies: ['AWS', 'Docker', 'ELK Stack', 'OpenVPN', 'Nginx', 'Teltonika Routers'],
      color: 'from-emerald-600 to-teal-600',
      icon: Wifi
    },
    {
      title: language === 'en' ? 'AI Integration on Edge (Jetson)' : 'Intégration IA sur Edge (Jetson)',
      subtitle: language === 'en' ? 'Computer Vision & Edge Deployment' : 'Vision par Ordinateur & Déploiement Edge',
      period: '06/2025 - 11/2025',
      description: language === 'en'
        ? 'Trained and deployed YOLO model on NVIDIA Jetson for real-time object detection with 97% accuracy.'
        : 'Entraînement et déploiement d\'un modèle YOLO sur NVIDIA Jetson pour la détection d\'objets en temps réel avec 97% de précision.',
      highlights: language === 'en' ? [
        'Trained YOLO (Ultralytics/PyTorch) model with iterative improvement via dataset pipeline (97% detection accuracy)',
        'Auto-annotation with SAM3, verification/validation in Roboflow, TensorRT export and Jetson integration',
        'Performance optimization: from ~5 FPS to 30 FPS (6x improvement, 500%)'
      ] : [
        'Entraînement d\'un modèle YOLO (Ultralytics/PyTorch) avec amélioration itérative via pipeline dataset (97% accuracy)',
        'Auto-annotation SAM3, vérification/validation dans Roboflow, export TensorRT et intégration Jetson',
        'Optimisation des performances : passage de ~5 FPS à 30 FPS (amélioration 6x, 500%)'
      ],
      technologies: ['YOLO', 'PyTorch', 'TensorRT', 'NVIDIA Jetson', 'SAM3', 'Roboflow', 'Python'],
      color: 'from-orange-600 to-amber-600',
      icon: Cpu
    }
  ];

  return (
    <section id="projects" className="py-24 relative grid-pattern">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 bg-amber-500/20 text-amber-500 border-amber-500/30">
            <Terminal className="w-4 h-4 mr-1" />
            {t('projects.badge') as string}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            {t('projects.title') as string}{' '}
            <span className="gradient-text">{t('projects.subtitle') as string}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            {t('projects.description') as string}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => {
            const Icon = project.icon;
            return (
              <div 
                key={i} 
                className="group relative glass rounded-3xl overflow-hidden project-card reveal"
              >
                {/* Gradient header */}
                <div className={`h-32 bg-gradient-to-r ${project.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-black/30 text-white border-0 backdrop-blur-sm">
                      {project.period}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{project.title}</h3>
                  <p className={`text-transparent bg-clip-text bg-gradient-to-r ${project.color} font-medium mb-4`}>
                    {project.subtitle}
                  </p>
                  <p className="text-[var(--text-secondary)] mb-4">{project.description}</p>
                  
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{t('projects.highlights') as string}</p>
                  <ul className="space-y-2 mb-4">
                    {project.highlights.map((highlight, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.color} mt-2 flex-shrink-0`} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, j) => (
                      <span 
                        key={j}
                        className="px-3 py-1 rounded-full text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Missing Wifi icon component
function Wifi({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

// Certifications Section
const CertificationsSection = () => {
  const { language, t } = useLanguage();
  
  const certifications = [
    {
      title: 'Linguaskill Business English',
      issuer: 'Cambridge',
      description: language === 'en' 
        ? 'Cambridge certification attesting advanced level in business English, evaluating professional communication skills.'
        : 'Certification Cambridge attestant un niveau avancé en anglais des affaires.',
      icon: Globe,
      color: 'blue'
    },
    {
      title: 'Deep learning spécialisation',
      issuer: 'Deep-Learning.AI',
      icon: Cpu,
      color: 'teal'
    },
    {
      title: 'DÉVELOPPEUR DEEPLEARNING.AI TENSORFLOW',
      issuer: 'DeepLearning.AI',
      icon: CheckCircle2,
      color: 'orange'
    },
    {
      title: 'Développement Web Node.JS',
      issuer: 'Udemy',
      icon: Server,
      color: 'sky'
    },
  ];

  const education = [
    {
      degree: language === 'en' ? 'Engineering Degree (Bac+5)' : 'Diplôme d\'Ingénieur (Bac+5)',
      field: language === 'en' ? 'Information Systems' : 'Systèmes d\'Information',
      school: 'Université de Technologie de Troyes (UTT)',
      period: '02/2021 - 03/2024',
      location: 'Troyes, France'
    },
    {
      degree: language === 'en' ? 'Preparatory Cycle (Bac+2)' : 'Tronc Commun (Bac+2)',
      field: 'General Engineering',
      school: 'Université Libanaise - Faculté de Génie (ULFG)',
      period: '09/2018 - 12/2020',
      location: language === 'en' ? 'Tripoli, Lebanon' : 'Tripoli, Liban'
    }
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    teal: 'bg-teal-500/20 text-teal-500 border-teal-500/30',
    orange: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    sky: 'bg-sky-500/20 text-sky-500 border-sky-500/30',
  };

  return (
    <section id="certifications" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-950/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 bg-sky-500/20 text-sky-500 border-sky-500/30">
            <Award className="w-4 h-4 mr-1" />
            {t('certifications.badge') as string}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            {t('certifications.title') as string}{' '}
            <span className="gradient-text">{t('certifications.subtitle') as string}</span>
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Certifications */}
          <div className="reveal">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-500" />
              {t('certifications.certifications') as string}
            </h3>
            <div className="space-y-4">
              {certifications.map((cert, i) => {
                const Icon = cert.icon;
                return (
                  <div key={i} className="glass rounded-2xl p-5 skill-card">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[cert.color]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[var(--text-primary)]">{cert.title}</h4>
                        <p className="text-sm text-orange-500">{cert.issuer}</p>
                        {cert.description ? (
                          <p className="text-sm text-[var(--text-secondary)] mt-1">{cert.description}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Education */}
          <div className="reveal">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-teal-500" />
              {t('certifications.education') as string}
            </h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="glass rounded-2xl p-5 skill-card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">{edu.degree}</h4>
                      <p className="text-orange-500">{edu.field}</p>
                    </div>
                    <Badge variant="outline" className="border-[var(--border-color)] text-[var(--text-secondary)]">
                      {edu.period}
                    </Badge>
                  </div>
                  <p className="text-[var(--text-secondary)]">{edu.school}</p>
                  <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Languages */}
            <div className="mt-6 glass rounded-2xl p-5">
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">{t('certifications.languages') as string}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">{language === 'en' ? 'French' : 'Français'}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                    {t('certifications.fluent') as string}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">{language === 'en' ? 'English' : 'Anglais'}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                    C1+ ({t('certifications.fluent') as string})
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">{language === 'en' ? 'Arabic' : 'Arabe'}</span>
                  <Badge className="bg-slate-500/20 text-[var(--text-secondary)] border-slate-500/30">
                    {t('certifications.native') as string}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const { t } = useLanguage();
  const cvFilePath = './bucket/abdallah.kassan.pdf';
  
  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'abdallah.kassan.job@outlook.fr', href: 'mailto:abdallah.kassan.job@outlook.fr' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/kassan-abdallah', href: 'https://www.linkedin.com/in/kassan-abdallah' },
    { icon: Github, label: 'GitHub', value: 'github.com/kassanabdallah0', href: 'https://github.com/kassanabdallah0' },
    { icon: GitBranch, label: 'GitLab', value: 'gitlab.com/abdallah.kassan', href: 'https://gitlab.com/abdallah.kassan' },
    { icon: Phone, label: 'Phone', value: '+33 7 88 09 35 91', href: 'tel:+33788093591' },
    { icon: MapPin, label: 'Location', value: 'Caen 14000, France', href: '#' },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 bg-amber-500/20 text-amber-500 border-amber-500/30">
            <Mail className="w-4 h-4 mr-1" />
            {t('contact.badge') as string}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            {t('contact.title') as string}{' '}
            <span className="gradient-text">{t('contact.subtitle') as string}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            {t('contact.description') as string}
          </p>
        </div>
        
        <div className="glass rounded-3xl p-8 md:p-12 reveal">
          <div className="grid sm:grid-cols-2 gap-6">
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                    <p className="text-[var(--text-primary)] font-medium group-hover:text-orange-500 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
          
          <div className="mt-10 pt-8 border-t border-[var(--border-color)] text-center">
            <p className="text-[var(--text-secondary)] mb-4">{t('contact.downloadCV') as string}</p>
            <Button
              asChild
              size="lg"
              className="btn-shine bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-500 hover:to-teal-500 text-white border-0"
            >
              <a href={cvFilePath} download="abdallah.kassan.pdf">
                <ExternalLink className="w-5 h-5 mr-2" />
                {t('contact.downloadCV') as string}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="py-8 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold gradient-text">Kassan Abdallah</div>
          <p className="text-[var(--text-muted)] text-sm">
            © 2025 Kassan Abdallah. {t('footer.rights') as string}
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/kassan-abdallah" className="text-[var(--text-muted)] hover:text-orange-500 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/kassanabdallah0" className="text-[var(--text-muted)] hover:text-orange-500 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://gitlab.com/abdallah.kassan" className="text-[var(--text-muted)] hover:text-orange-500 transition-colors">
              <GitBranch className="w-5 h-5" />
            </a>
            <a href="mailto:abdallah.kassan.job@outlook.fr" className="text-[var(--text-muted)] hover:text-orange-500 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Content Component
function AppContent() {
  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll('.reveal'));

    // Fallback for environments where IntersectionObserver is unavailable.
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('active'));
      return;
    }

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navigation />
      <HeroSection />
      <JobSeekingSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <CertificationsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default function PortfolioPage() {
  return <AppContent />;
}


