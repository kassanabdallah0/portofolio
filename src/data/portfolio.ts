// Public portfolio copy, selected from the October 2026 reference CV.
// Field observations are estimates, never independent benchmarks.
export const profile = {
  name: 'Abdallah Kassan',
  email: 'abdallah.kassan.job@outlook.fr',
  location: 'Caen, France',
  github: 'https://github.com/kassanabdallah0',
  linkedin: 'https://www.linkedin.com/in/kassan-abdallah',
  cv: '/portofolio/bucket/abdallah.kassan.pdf',
};

export const navigation = [
  ['accueil', 'Accueil'],
  ['a-propos', 'À propos'],
  ['expertise', 'Expertise'],
  ['projets', 'Projets'],
  ['technologies', 'Technologies'],
  ['parcours', 'Parcours'],
] as const;

export type Project = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'vision' | 'logiciel' | 'cloud';
  label: string;
  visual: 'vision' | 'interface' | 'cloud' | 'delivery';
  description: string;
  tags: string[];
  context: string;
  contribution: string[];
  result: string;
  scope: string;
  flow: string[];
};

export const projects: Project[] = [
  {
    slug: 'jetson-vision',
    number: '01',
    title: 'La vision au plus près du terrain.',
    subtitle: 'SecuriSPOT · Vision industrielle',
    category: 'vision',
    label: 'VISION & IA EMBARQUÉE',
    visual: 'vision',
    description:
      'De la caméra à la décision : un pipeline de vision optimisé sur NVIDIA Jetson pour la sécurité industrielle.',
    tags: ['Python', 'YOLO', 'TensorRT', 'NVIDIA Jetson'],
    context:
      'Les dispositifs SecuriSPOT analysent des flux caméra sur site pour détecter des situations à risque. Le défi : traiter la vidéo avec une latence maîtrisée, sur un matériel embarqué, tout en limitant les fausses alertes.',
    contribution: [
      'Contribution au backend Python/Flask multiprocessus sur Jetson Orin, avec acquisition Intel RealSense et traitements OpenCV.',
      'Remplacement de la segmentation par la détection lorsque les masques étaient inutiles, optimisation des exports YOLO/TensorRT et réduction des transferts d’images entre processus.',
      'Développement de règles temporelles par suivi d’objet, avec fenêtres FIFO et seuils de confirmation paramétrables.',
    ],
    result:
      'Débit de traitement passé d’environ 5 à 30 images/s sur le pipeline concerné ; plus de 80 % de fausses alertes en moins dans les scénarios observés.',
    scope:
      'Projet professionnel en équipe chez Fastpoint. Résultats issus d’estimations et d’observations terrain, sans benchmark instrumenté ; ils ne mesurent pas le débit d’affichage ni tous les modèles.',
    flow: [
      'Caméra RealSense',
      'YOLO · TensorRT',
      'Règles temporelles',
      'Alertes terrain',
    ],
  },
  {
    slug: 'securispot',
    number: '02',
    title: 'Rendre les systèmes accessibles.',
    subtitle: 'SecuriSPOT Manager · Application métier',
    category: 'logiciel',
    label: 'INGÉNIERIE LOGICIELLE',
    visual: 'interface',
    description:
      'Une interface de configuration et de supervision qui donne aux utilisateurs la maîtrise de leurs équipements.',
    tags: ['React', 'TypeScript', 'Flask', 'API REST'],
    context:
      'La configuration des zones de détection nécessitait une intervention technique. SecuriSPOT Manager relie l’image caméra, les règles de sécurité et les alarmes dans une application utilisable directement par les clients.',
    contribution: [
      'Conception et développement de l’application React/TypeScript et de son backend Python/Flask, de l’UX aux API REST.',
      'Configuration graphique des zones d’intérêt, visualisation des détections et tableaux de bord des alarmes.',
      'Historique des captures avec métadonnées, miniatures et chargement différé ; gestion des erreurs et pertes de connexion.',
    ],
    result:
      'Configuration d’une zone ramenée de 30–60 minutes avec intervention technique à moins de 2 minutes en libre-service, selon les estimations terrain. Application utilisée sur environ 5 à 6 installations.',
    scope:
      'Application développée chez Fastpoint, intégrée aux produits de l’équipe. Les visuels du portfolio sont des schémas illustratifs, pas des captures de production.',
    flow: [
      'Interface React',
      'API Flask',
      'Configuration Jetson',
      'Supervision',
    ],
  },
  {
    slug: 'mediaspot',
    number: '03',
    title: 'Connecter une flotte au cloud.',
    subtitle: 'MediaSpot · Mobilité connectée',
    category: 'cloud',
    label: 'CLOUD & SYSTÈMES CONNECTÉS',
    visual: 'cloud',
    description:
      'Migration de 70 bus vers AWS, portail passagers et services de supervision construits pour l’exploitation.',
    tags: ['Node.js', 'TypeScript', 'AWS', 'OpenVPN'],
    context:
      'Le portail Wi-Fi de 70 bus Cap Cotentin reposait sur un PC dans chaque véhicule. La migration vers AWS centralise les services et simplifie le diagnostic à distance.',
    contribution: [
      'Migration de 70 bus vers AWS, configuration des routeurs Teltonika et du réseau OpenVPN avec authentification par certificats.',
      'Conception du backend Node.js/TypeScript en architecture hexagonale : API REST, AWS Lambda, JWT et contrôle des accès IAM.',
      'Développement du portail React et du lecteur PDF à chargement progressif ; refonte du reporting mensuel avec CloudWatch, EventBridge et SES.',
    ],
    result:
      '70 PC embarqués supprimés. Les déplacements de maintenance sont passés d’environ 2–3 par mois à un tous les six mois, soit une réduction estimée de 92–94 %.',
    scope:
      'Travaux réalisés chez Fastpoint. La chaîne initiale d’alimentation des journaux et le principe du reporting automatique préexistaient. Les gains de maintenance sont des estimations terrain.',
    flow: [
      'Routeurs des bus',
      'OpenVPN · EC2',
      'API · Lambda',
      'Portail · Rapports',
    ],
  },
  {
    slug: 'edge-delivery',
    number: '04',
    title: 'Livrer. Vérifier. Restaurer.',
    subtitle: 'Déploiement Jetson · Fiabilité logicielle',
    category: 'cloud',
    label: 'DEVOPS & SYSTÈMES EMBARQUÉS',
    visual: 'delivery',
    description:
      'Une chaîne de livraison versionnée, des contrôles sur l’équipement et un retour arrière automatique.',
    tags: ['Docker', 'GitLab CI/CD', 'Linux', 'pytest'],
    context:
      'Une mise à jour sur le terrain doit composer avec les caméras, les moteurs d’inférence et les dépendances système. La chaîne de livraison rend ces opérations reproductibles et récupérables.',
    contribution: [
      'Mise en place d’une chaîne GitLab CI/CD déclenchée par tag : tests Jest/pytest, préparation des releases et publication des images Docker.',
      'Automatisation des vérifications caméra/USB, dépendances, modèles, health checks et smoke tests sur chaque Jetson.',
      'Développement du retour automatique à la version précédente en cas d’échec récupérable, avec vérification du service restauré.',
    ],
    result:
      'Mise à jour du code ramenée d’environ 3 heures à moins de 5 minutes sur un Jetson déjà provisionné ; restauration en moins de 2 minutes dans les cas récupérables.',
    scope:
      'Estimations terrain. La mise à jour finale reste déclenchée par une commande locale contrôlée ; les premières installations et les téléchargements d’images ont un périmètre différent.',
    flow: [
      'Tag Git',
      'Tests · Images',
      'Contrôles Jetson',
      'Activation · Repli',
    ],
  },
];

export const expertise = [
  {
    icon: 'brain',
    label: '01 / INTELLIGENCE ARTIFICIELLE',
    title: 'Comprendre l’image.',
    description:
      'Intégrer les modèles et transformer leurs prédictions en décisions utiles.',
    tags: ['Vision par ordinateur', 'YOLO · PyTorch', 'Suivi d’objets'],
  },
  {
    icon: 'chip',
    label: '02 / IA EMBARQUÉE',
    title: 'Rapprocher l’intelligence.',
    description:
      'Faire fonctionner l’inférence au plus près du capteur, avec les contraintes du terrain.',
    tags: ['NVIDIA Jetson', 'TensorRT', 'Optimisation vidéo'],
  },
  {
    icon: 'code',
    label: '03 / GÉNIE LOGICIEL',
    title: 'Construire pour durer.',
    description:
      'Relier une interface claire à des services structurés, testés et maintenables.',
    tags: ['React · TypeScript', 'Python · Node.js', 'Architecture hexagonale'],
  },
  {
    icon: 'network',
    label: '04 / SYSTÈMES CONNECTÉS',
    title: 'Relier le monde réel.',
    description:
      'Connecter équipements, logiciels et cloud dans un système exploitable au quotidien.',
    tags: ['IoT · AWS', 'Linux · Docker', 'Supervision · CI/CD'],
  },
];

export const technologies = [
  {
    label: 'LANGAGES',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash'],
    note: 'C / C++ : bases de formation et projets.',
  },
  {
    label: 'IA & VISION',
    items: ['PyTorch', 'YOLO', 'OpenCV', 'TensorRT', 'TensorFlow'],
    note: 'TensorFlow : formation et certifications Coursera.',
  },
  {
    label: 'LOGICIEL & CLOUD',
    items: ['React', 'Node.js', 'Flask', 'AWS', 'PostgreSQL'],
    note: 'Des interfaces aux API et aux services cloud.',
  },
  {
    label: 'EMBARQUÉ & LIVRAISON',
    items: [
      'NVIDIA Jetson',
      'Linux',
      'Docker',
      'GitLab CI/CD',
      'Jest · pytest',
    ],
    note: 'Intégration, tests, déploiement et diagnostic.',
  },
];

export const timeline = [
  {
    date: 'SEPT. 2024 — AUJOURD’HUI',
    title: 'Ingénieur logiciel Full Stack',
    organization: 'Fastpoint',
    location: 'CDI · Caen',
    description:
      'Du besoin utilisateur à la production : applications web, backend, cloud AWS, vision embarquée sur Jetson et industrialisation des releases.',
    current: true,
  },
  {
    date: '2021 — 2024',
    title: 'Diplôme d’ingénieur',
    organization: 'Université de Technologie de Troyes',
    location: 'Systèmes de Réseaux Convergents',
    description:
      'Une formation d’ingénieur à l’intersection du logiciel, des réseaux et des systèmes.',
    current: false,
  },
  {
    date: 'JUIL. — DÉC. 2023',
    title: 'Développeur web Full Stack',
    organization: 'KEOS Telecom',
    location: 'Stage · Paris',
    description:
      'Développement et maintenance d’une application métier PHP/MySQL : interfaces, backend, requêtes SQL, tests et documentation.',
    current: false,
  },
  {
    date: 'FÉV. — JUIL. 2022',
    title: 'Développeur logiciel & traitement d’image',
    organization: 'HMRexpert',
    location: 'Stage · Bourgogne-Franche-Comté',
    description:
      'Application Qt sous Linux, modules de traitement d’image OpenCV, intégration et validation.',
    current: false,
  },
];
