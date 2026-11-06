// Public portfolio copy, selected from the October 2026 reference CV.
// Field observations are estimates, never independent benchmarks.
export const profile = {
  name: 'Abdallah Kassan',
  email: 'abdallah.kassan.job@outlook.fr',
  location: 'Caen, France',
  github: 'https://github.com/kassanabdallah0',
  linkedin: 'https://www.linkedin.com/in/kassan-abdallah',
  cv: '/portofolio/bucket/CV_Reference_Abdallah_Kassan_2026.pdf',
  cvFilename: 'CV_Reference_Abdallah_Kassan_2026.pdf',
  gitlab: 'https://gitlab.com/abdallah.kassan',
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
  category: 'vision' | 'logiciel' | 'cloud' | 'operations';
  label: string;
  visual:
    'vision' | 'interface' | 'cloud' | 'delivery' | 'scan' | 'observability';
  description: string;
  tags: string[];
  context: string;
  contribution: string[];
  result: string;
  scope: string;
  flow: string[];
  role: string;
  decision: string;
  metric: { value: string; label: string; note: string };
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
    role: 'Intégration IA, backend multiprocessus et optimisation du pipeline',
    decision:
      'Faire circuler les identifiants de frames, les classes et les boîtes englobantes entre processus, puis récupérer les images seulement pour une alarme ou l’affichage. La détection remplace la segmentation lorsque les masques n’apportent rien au cas d’usage.',
    metric: {
      value: '≈ 5 → 30 FPS',
      label: 'Débit de traitement du pipeline',
      note: 'Observation terrain · périmètre détaillé dans l’étude',
    },
    context:
      'Les dispositifs SecuriSPOT analysent des flux caméra sur site pour détecter des situations à risque. Le défi : traiter la vidéo avec une latence maîtrisée, sur un matériel embarqué, tout en limitant les fausses alertes.',
    contribution: [
      'Contribution au backend Python/Flask multiprocessus sur Jetson Orin, avec acquisition Intel RealSense et traitements OpenCV.',
      'Remplacement de la segmentation par la détection lorsque les masques étaient inutiles, optimisation des exports YOLO/TensorRT et réduction des transferts d’images entre processus.',
      'Développement de règles temporelles par suivi d’objet : fenêtre FIFO d’environ 30 frames et seuils de confirmation paramétrables de 3, 6 ou 10 observations.',
      'Préparation de jeux de données et intégration de modèles avec Roboflow, PyTorch et Ultralytics, adaptés aux contraintes des équipements et des sites.',
    ],
    result:
      'Débit de traitement passé d’environ 5 à 30 images/s sur le pipeline concerné ; plus de 80 % de fausses alertes en moins dans les scénarios observés. Délai estimé entre événement et activation de l’alerte ramené d’environ 1–1,5 s à 100–250 ms.',
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
    role: 'Conception produit, UX/UI, développement frontend et backend',
    decision:
      'Rendre la configuration directement manipulable sur l’image caméra et exposer les paramètres par API Flask. L’historique charge progressivement les miniatures et leurs métadonnées pour rester utilisable sur l’équipement embarqué.',
    metric: {
      value: '< 2 min',
      label: 'Pour reconfigurer une zone en autonomie',
      note: 'Contre 30–60 min avec intervention · estimation terrain',
    },
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
    role: 'Migration cloud, architecture backend, réseau et portail React',
    decision:
      'Centraliser les services sur AWS et séparer domaine, application et infrastructure dans un backend hexagonal. Les routeurs restent dans les bus ; le portail, la supervision et le reporting sont exploités à distance.',
    metric: {
      value: '70 bus',
      label: 'Migrés vers une architecture AWS',
      note: '70 PC embarqués supprimés',
    },
    context:
      'Le portail Wi-Fi de 70 bus Cap Cotentin reposait sur un PC dans chaque véhicule. La migration vers AWS centralise les services et simplifie le diagnostic à distance.',
    contribution: [
      'Migration de 70 bus vers AWS, configuration des routeurs Teltonika et du réseau OpenVPN avec authentification par certificats.',
      'Conception du backend Node.js/TypeScript en architecture hexagonale : API REST, AWS Lambda, JWT et contrôle des accès IAM.',
      'Développement du portail React et du lecteur PDF à chargement progressif ; refonte du reporting mensuel avec CloudWatch, EventBridge et SES.',
      'Configuration EC2, VPC, Security Groups, routage et certificats VPN ; supervision des routeurs par SMS, OpenVPN et Teltonika RMS selon les besoins.',
      'Déploiement des Lambda par scripts Bash et AWS CLI. Infrastructure configurée principalement via AWS Console.',
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
    role: 'Conception de la chaîne de livraison et fiabilisation des releases',
    decision:
      'Séparer la préparation automatique d’une release de son activation contrôlée sur le Jetson. La mise à jour n’est validée qu’après les vérifications matérielles et applicatives ; un échec récupérable déclenche le retour à la version précédente.',
    metric: {
      value: '< 5 min',
      label: 'Pour mettre à jour le code sur Jetson',
      note: 'Équipement déjà provisionné · estimation terrain',
    },
    context:
      'Une mise à jour sur le terrain doit composer avec les caméras, les moteurs d’inférence et les dépendances système. La chaîne de livraison rend ces opérations reproductibles et récupérables.',
    contribution: [
      'Mise en place d’une chaîne GitLab CI/CD déclenchée par tag : tests Jest/pytest, préparation des releases et publication des images Docker.',
      'Automatisation des vérifications caméra/USB, dépendances, modèles, health checks et smoke tests sur chaque Jetson.',
      'Développement du retour automatique à la version précédente en cas d’échec récupérable, avec vérification du service restauré.',
      'Gestion des services Linux : NTP, rotation des journaux et rétention de 7 jours des captures et métadonnées d’alarmes.',
      'Livraison de versions adaptées aux installations COLAS, IDEA et SNCF, avec branches/tags spécifiques, environnement Docker commun et exports de modèles adaptés.',
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
  {
    slug: 'colas-scan-epi',
    number: '05',
    title: 'Une interaction fluide, sur le terrain.',
    subtitle: 'COLAS · Scan EPI sur télévision industrielle',
    category: 'logiciel',
    label: 'INTERFACE INDUSTRIELLE & VIDÉO',
    visual: 'scan',
    description:
      'Repenser l’architecture d’un scan d’équipements de protection pour rendre l’affichage réactif et la maintenance accessible à distance.',
    tags: ['React', 'Chromium / Weston', 'GStreamer', 'WebRTC'],
    role: 'Architecture d’affichage, interfaces React et états métier du scan',
    metric: {
      value: '10 FPS',
      label: 'Cadence d’affichage retenue en production',
      note: 'Contre environ 2–3 FPS sur le navigateur de la TV',
    },
    context:
      'La première version de l’application s’exécutait dans le navigateur de la télévision industrielle. Son affichage à environ 2–3 FPS pénalisait les interactions pendant le scan EPI et compliquait le diagnostic à distance.',
    decision:
      'Déplacer l’application vers Chromium/Weston sur le Jetson, relié à la TV en HDMI, et diffuser la vidéo localement avec GStreamer/WebRTC. Le backend porte les décisions et les états du scan pour maintenir une logique métier cohérente.',
    contribution: [
      'Identification du navigateur de la TV comme limite de l’architecture, puis proposition et développement de la nouvelle exécution sur Jetson.',
      'Conception des parcours React/TypeScript de stabilisation, acquisition, validation et restitution du résultat.',
      'Déplacement des états métier dans le backend et intégration de la vidéo locale avec GStreamer/WebRTC.',
      'Accès au diagnostic et aux mises à jour à distance via le Jetson ; intégration au processus de release automatisé.',
    ],
    result:
      'Affichage final réglé à 10 FPS, contre environ 2–3 FPS auparavant ; 15–20 FPS observés pendant les essais. L’application devient accessible au diagnostic et aux mises à jour à distance.',
    scope:
      'Projet réalisé chez Fastpoint pour COLAS. Mon périmètre couvre l’architecture, l’application et les états métier ; la détection par modèle IA était développée par un collègue. Les FPS concernent l’affichage et ne décrivent pas le débit d’inférence.',
    flow: [
      'Caméra · Jetson',
      'GStreamer · WebRTC',
      'React · Chromium',
      'HDMI · Télévision',
    ],
  },
  {
    slug: 'elk-exploitation',
    number: '06',
    title: 'Garder la production observable.',
    subtitle: 'Cluster ELK · Exploitation & sécurité',
    category: 'operations',
    label: 'DONNÉES & EXPLOITATION',
    visual: 'observability',
    description:
      'Superviser un cluster Elasticsearch, maîtriser la rétention et sécuriser les échanges pour soutenir le diagnostic en production.',
    tags: ['Elasticsearch', 'Logstash', 'Kibana', 'TLS / ILM'],
    role: 'Supervision, maintenance du stockage et sécurisation du cluster',
    metric: {
      value: '3 nœuds',
      label: 'Un cluster ELK supervisé et maintenu',
      note: 'Politiques de rétention des index à 180 jours',
    },
    context:
      'Le cluster ELK de Fastpoint centralise les journaux utiles à l’exploitation. Il a historiquement atteint environ 306 millions de documents et 644 Go de données, avec un besoin de maîtrise du stockage et de sécurisation des accès.',
    decision:
      'Traiter la conservation des données comme une règle d’exploitation : automatiser la suppression des anciens index avec ILM à 180 jours et sécuriser les accès HTTPS ainsi que les communications entre nœuds par certificats TLS.',
    contribution: [
      'Supervision et maintenance d’un cluster Elasticsearch/Logstash/Kibana de trois nœuds.',
      'Opérations de nettoyage du stockage et configuration des politiques ILM pour supprimer automatiquement les index de plus de 180 jours.',
      'Création et configuration des certificats TLS pour Elasticsearch, Kibana et les communications inter-nœuds.',
      'Analyse des journaux dans le cadre du diagnostic en production, en complément des investigations Linux, Docker et applicatives.',
    ],
    result:
      'Une rétention automatisée des index et des communications sécurisées par TLS. L’exploitation du cluster dispose de règles explicites pour le cycle de vie des données.',
    scope:
      'Les 306 millions de documents et 644 Go sont des volumes historiques, pas un benchmark ni un objectif de performance. Une partie provenait de journaux trop nombreux ; leur correction côté SecuriSPOT a été réalisée par un collègue.',
    flow: [
      'Journaux applicatifs',
      'Logstash',
      'Elasticsearch · ILM',
      'Kibana · TLS',
    ],
  },
];

export const impact = [
  {
    value: '70',
    unit: 'bus',
    label: 'migrés vers AWS',
    detail: '70 PC embarqués supprimés',
    project: 'mediaspot',
  },
  {
    value: '≈ 5 → 30',
    unit: 'FPS',
    label: 'sur un pipeline de vision',
    detail: 'Optimisation du traitement vidéo¹',
    project: 'jetson-vision',
  },
  {
    value: '< 2',
    unit: 'min',
    label: 'pour configurer une zone',
    detail: 'Contre 30–60 min avec intervention¹',
    project: 'securispot',
  },
  {
    value: '< 5',
    unit: 'min',
    label: 'pour une mise à jour Jetson',
    detail: 'Code, sur équipement provisionné¹',
    project: 'edge-delivery',
  },
];

export const approach = [
  {
    number: '01',
    title: 'Partir de l’usage.',
    description:
      'Comprendre le besoin, les contraintes du site et les gestes de l’utilisateur.',
  },
  {
    number: '02',
    title: 'Relier les couches.',
    description:
      'Concevoir ensemble l’interface, les API, les données et l’équipement.',
  },
  {
    number: '03',
    title: 'Assurer la suite.',
    description:
      'Tester, livrer, observer et diagnostiquer le système en production.',
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
      'Concevoir des interfaces React et des API Python/Node.js, avec contrats typés, tests et architecture hexagonale.',
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
    label: 'INTERFACES & BACKEND',
    items: ['React', 'Node.js', 'Flask', 'API REST', 'Architecture hexagonale'],
    note: 'Interfaces métier, services typés et séparation domaine / infrastructure.',
  },
  {
    label: 'VISION & IA EMBARQUÉE',
    items: [
      'NVIDIA Jetson',
      'YOLO / PyTorch',
      'OpenCV',
      'TensorRT',
      'GStreamer / WebRTC',
    ],
    note: 'Acquisition RealSense, intégration des modèles et optimisation vidéo.',
  },
  {
    label: 'CLOUD & RÉSEAU',
    items: [
      'AWS EC2 / Lambda',
      'S3 / API Gateway',
      'IAM / VPC',
      'OpenVPN / TLS',
      'EventBridge / SES',
    ],
    note: 'Réseaux, contrôle des accès, services cloud et reporting automatisé.',
  },
  {
    label: 'DONNÉES & OBSERVABILITÉ',
    items: [
      'PostgreSQL / MySQL',
      'DynamoDB',
      'Elasticsearch',
      'Logstash / Kibana',
      'CloudWatch',
    ],
    note: 'Données applicatives, journaux, rétention ILM et diagnostic.',
  },
  {
    label: 'LIVRAISON & QUALITÉ',
    items: [
      'Linux / Bash',
      'Docker',
      'GitLab CI/CD',
      'Jest / pytest',
      'Health checks / rollback',
    ],
    note: 'Tests, releases versionnées, contrôles et restauration du service.',
  },
];

export const technologyMarks: Record<string, string> = {
  Python: 'Py',
  TypeScript: 'TS',
  JavaScript: 'JS',
  SQL: 'SQL',
  Bash: 'sh',
  React: 'Re',
  'Node.js': 'Nd',
  Flask: 'Fl',
  'API REST': '{}',
  'Architecture hexagonale': 'Hex',
  'NVIDIA Jetson': 'Nv',
  'YOLO / PyTorch': 'AI',
  OpenCV: 'CV',
  TensorRT: 'TRT',
  'GStreamer / WebRTC': 'RTC',
  'AWS EC2 / Lambda': 'AWS',
  'S3 / API Gateway': 'S3',
  'IAM / VPC': 'IAM',
  'OpenVPN / TLS': 'TLS',
  'EventBridge / SES': 'SES',
  'PostgreSQL / MySQL': 'SQL',
  DynamoDB: 'Db',
  Elasticsearch: 'Es',
  'Logstash / Kibana': 'ELK',
  CloudWatch: 'CW',
  'Linux / Bash': 'sh',
  Docker: 'Dk',
  'GitLab CI/CD': 'Git',
  'Jest / pytest': 'Tst',
  'Health checks / rollback': '↺',
};

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
