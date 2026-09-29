export type Localized = { fr: string; en: string };
const l = (fr: string, en: string): Localized => ({ fr, en });

export const profile = {
  name: 'Abdallah Kassan',
  email: 'abdallah.kassan.job@outlook.fr',
  phone: '+33 7 88 09 35 91',
  phoneHref: 'tel:+33788093591',
  github: 'https://github.com/kassanabdallah0',
  gitlab: 'https://gitlab.com/abdallah.kassan',
  linkedin: 'https://www.linkedin.com/in/kassan-abdallah',
  title: l('Développeur Full Stack', 'Full Stack Developer'),
  summary: l(
    'Ingénieur UTT, je développe des interfaces React/TypeScript, des API Python et Node.js, et des services AWS. Mon expérience chez Fastpoint relie applications web et vision temps réel sur NVIDIA Jetson.',
    'An engineering graduate from UTT, I develop React/TypeScript interfaces, Python and Node.js APIs, and AWS services. My work at Fastpoint connects web applications with real-time vision on NVIDIA Jetson.',
  ),
};

export const categories = [
  { id: 'all', label: l('Tous les projets', 'All projects') },
  { id: 'web', label: l('Web & API', 'Web & APIs') },
  { id: 'cloud', label: l('Cloud & livraison', 'Cloud & delivery') },
  { id: 'edge', label: l('Vision & edge', 'Vision & edge') },
] as const;
export type Category = (typeof categories)[number]['id'];
export type Project = {
  slug: string;
  number: string;
  name: Localized;
  category: Exclude<Category, 'all'>;
  subtitle: Localized;
  summary: Localized;
  role: Localized;
  context: Localized;
  challenge: Localized;
  actions: Localized[];
  results: Localized[];
  note: Localized;
  stack: string[];
  flow: Localized[];
  lesson: Localized;
};

export const projects: Project[] = [
  {
    slug: 'securispot',
    number: '01',
    name: l('SecuriSPOT', 'SecuriSPOT'),
    category: 'web',
    subtitle: l(
      'Une interface pour les systèmes de vision.',
      'A web interface for vision systems.',
    ),
    summary: l(
      'Configuration sur image caméra, suivi des alarmes et échanges avec les API embarquées.',
      'Camera-image configuration, alarm monitoring and integration with embedded APIs.',
    ),
    role: l(
      'Développement frontend et intégration API',
      'Frontend development and API integration',
    ),
    context: l(
      'Les systèmes de vision ont besoin d’une interface pour configurer les équipements et comprendre les événements détectés. Chez Fastpoint, j’ai contribué aux interfaces SecuriSPOT et aux outils de supervision associés.',
      'Vision systems need an interface to configure devices and understand detected events. At Fastpoint, I contributed to SecuriSPOT interfaces and related monitoring tools.',
    ),
    challenge: l(
      'Relier les interactions dans le navigateur aux coordonnées de l’image caméra, tout en conservant une interface utilisable lorsque le flux vidéo ou le backend redémarre.',
      'Connect browser interactions to camera-image coordinates while keeping the interface usable when the video stream or backend restarts.',
    ),
    actions: [
      l(
        'Développé les composants React/TypeScript de configuration des zones, des pictogrammes et des états des équipements.',
        'Developed React/TypeScript components for zone configuration, pictograms and device states.',
      ),
      l(
        'Intégré les dimensions de l’image caméra et les appels REST pour synchroniser la configuration avec le backend.',
        'Integrated camera-image dimensions and REST calls to synchronize configuration with the backend.',
      ),
      l(
        'Contribué à la reconnexion vidéo et au repli vers des images JPEG lorsque le flux WebRTC se bloque.',
        'Contributed to video reconnection and a JPEG fallback when the WebRTC stream stalls.',
      ),
      l(
        'Développé des vues de supervision avec arborescence d’équipements, graphiques et suivi des alarmes.',
        'Developed monitoring views with device trees, charts and alarm tracking.',
      ),
    ],
    results: [
      l(
        'Des parcours de configuration reliés aux équipements et aux services métier.',
        'Configuration workflows connected to devices and application services.',
      ),
      l(
        'Une interface capable de reprendre l’affichage après une interruption du flux.',
        'An interface able to resume display after a stream interruption.',
      ),
    ],
    note: l(
      'Projet professionnel réalisé en équipe. Les schémas sont des représentations simplifiées ; le code et les écrans internes ne sont pas publiés.',
      'A professional team project. Diagrams are simplified representations; internal source code and screens are not published.',
    ),
    stack: ['React', 'TypeScript', 'Python', 'Flask', 'REST', 'WebRTC'],
    flow: [
      l('React / TypeScript', 'React / TypeScript'),
      l('API Flask', 'Flask API'),
      l('Caméra / Jetson', 'Camera / Jetson'),
    ],
    lesson: l(
      'Le comportement de reprise fait partie de l’expérience utilisateur : il faut traiter les états déconnectés autant que le fonctionnement nominal.',
      'Recovery behavior is part of the user experience: disconnected states need as much care as the normal path.',
    ),
  },
  {
    slug: 'mediaspot',
    number: '02',
    name: l('MediaSpot', 'MediaSpot'),
    category: 'cloud',
    subtitle: l(
      'Des usages aux rapports mensuels.',
      'From usage data to monthly reports.',
    ),
    summary: l(
      'Portail React et automatisation de rapports PDF avec Node.js/TypeScript, AWS Lambda, S3 et SES.',
      'A React portal and automated PDF reporting with Node.js/TypeScript, AWS Lambda, S3 and SES.',
    ),
    role: l(
      'Frontend, services backend et reporting',
      'Frontend, backend services and reporting',
    ),
    context: l(
      'MediaSpot associe un portail de consultation de contenus à des services cloud. J’ai travaillé sur les pages React et sur la chaîne de génération des rapports d’usage mensuels.',
      'MediaSpot combines a content portal with cloud services. I worked on React pages and the monthly usage-reporting pipeline.',
    ),
    challenge: l(
      'Transformer les données d’usage en un document consultable et distribué automatiquement, en tenant compte des périodes de reporting et de la rétention des journaux.',
      'Turn usage data into an accessible, automatically distributed document while accounting for reporting periods and log retention.',
    ),
    actions: [
      l(
        'Développé des pages React de consultation des articles, leur adaptation aux écrans et leurs appels d’API.',
        'Developed React article pages, responsive layouts and API integrations.',
      ),
      l(
        'Automatisé l’extraction des données d’usage et le rendu des rapports PDF en Node.js/TypeScript sur AWS Lambda.',
        'Automated usage-data extraction and PDF rendering in Node.js/TypeScript on AWS Lambda.',
      ),
      l(
        'Intégré l’archivage S3 et l’envoi des rapports par email avec Amazon SES.',
        'Integrated S3 archiving and email delivery through Amazon SES.',
      ),
      l(
        'Préservé le rapport archivé lorsque l’envoi email échoue et pris en compte la rétention des logs.',
        'Kept archived reports available when email delivery fails and accounted for log retention.',
      ),
    ],
    results: [
      l(
        'Un flux mensuel qui enchaîne extraction, génération PDF, archivage et envoi.',
        'A monthly workflow spanning extraction, PDF generation, archiving and delivery.',
      ),
      l(
        'Des rapports conservés dans S3 indépendamment du succès de l’envoi email.',
        'Reports retained in S3 independently of email-delivery success.',
      ),
    ],
    note: l(
      'Les ressources AWS et le flux ont été corroborés par les vérifications internes de mai 2026. Aucun gain de temps ou de coût non mesuré n’est annoncé.',
      'AWS resources and the workflow were corroborated by internal checks in May 2026. No unmeasured time or cost savings are claimed.',
    ),
    stack: [
      'React',
      'Node.js',
      'TypeScript',
      'AWS Lambda',
      'S3',
      'SES',
      'CloudWatch',
    ],
    flow: [
      l('CloudWatch', 'CloudWatch'),
      l('Lambda / PDF', 'Lambda / PDF'),
      l('S3 / SES', 'S3 / SES'),
    ],
    lesson: l(
      'Dissocier la production du document de sa distribution permet de conserver un résultat exploitable même en cas d’échec partiel.',
      'Separating document generation from distribution keeps a usable result available even after a partial failure.',
    ),
  },
  {
    slug: 'jetson-vision',
    number: '03',
    name: l('Vision sur Jetson', 'Jetson vision'),
    category: 'edge',
    subtitle: l(
      'Du modèle au système temps réel.',
      'From model to real-time system.',
    ),
    summary: l(
      'Intégration YOLO/TensorRT dans un backend Python/Flask sur NVIDIA Jetson Orin.',
      'YOLO/TensorRT integration in a Python/Flask backend on NVIDIA Jetson Orin.',
    ),
    role: l(
      'Intégration logicielle et livraison edge',
      'Software integration and edge delivery',
    ),
    context: l(
      'Les applications de vision de Fastpoint exécutent des traitements au plus près des caméras. Mon travail porte sur l’intégration des modèles, leur exposition par API et la livraison du runtime sur Jetson.',
      'Fastpoint vision applications run processing close to the cameras. My work covers model integration, API access and runtime delivery on Jetson.',
    ),
    challenge: l(
      'Faire fonctionner ensemble le runtime Python, les moteurs TensorRT et les dépendances du Jetson, puis observer le débit réel du pipeline de comptage.',
      'Make the Python runtime, TensorRT engines and Jetson dependencies work together, then observe the actual counting-pipeline throughput.',
    ),
    actions: [
      l(
        'Intégré les traitements YOLO/Ultralytics et TensorRT aux services Python/Flask.',
        'Integrated YOLO/Ultralytics and TensorRT processing into Python/Flask services.',
      ),
      l(
        'Contribué aux exports des moteurs et aux adaptations de compatibilité TensorRT.',
        'Contributed to engine exports and TensorRT compatibility changes.',
      ),
      l(
        'Adapté les entrées de build et la livraison Docker du runtime de comptage pour la cible Orin.',
        'Adapted build inputs and Docker delivery of the counting runtime for Orin.',
      ),
    ],
    results: [
      l(
        '29,3 images/s en moyenne observées dans les logs du pipeline de comptage du 10 au 12 août 2026.',
        '29.3 frames/s observed on average in counting-pipeline logs from August 10–12, 2026.',
      ),
      l(
        'Un runtime de vision intégré au backend et livré sur Jetson Orin.',
        'A vision runtime integrated into the backend and delivered on Jetson Orin.',
      ),
    ],
    note: l(
      'Mesure : moyenne arithmétique de 10 599 débits rapportés par le détecteur. Ce résultat concerne le comptage ; il ne mesure ni le débit de l’affichage, ni le pipeline PPE à deux modèles, ni un gain avant/après.',
      'Measurement: arithmetic mean of 10,599 detector-reported rates. This result concerns counting, not display frame rate, the two-model PPE pipeline or a before/after improvement.',
    ),
    stack: [
      'Python',
      'Flask',
      'YOLO / Ultralytics',
      'TensorRT',
      'OpenCV',
      'NVIDIA Jetson',
      'Docker',
    ],
    flow: [
      l('Caméra / OpenCV', 'Camera / OpenCV'),
      l('YOLO / TensorRT', 'YOLO / TensorRT'),
      l('API Python', 'Python API'),
    ],
    lesson: l(
      'Une mesure utile précise son périmètre : acquisition, inférence et affichage n’ont pas nécessairement la même cadence.',
      'A useful measurement defines its scope: acquisition, inference and display do not necessarily run at the same rate.',
    ),
  },
  {
    slug: 'wifi-observability',
    number: '04',
    name: l('Statistiques Wi-Fi', 'Wi-Fi statistics'),
    category: 'web',
    subtitle: l(
      'Des données cohérentes dans les graphiques.',
      'Consistent data for monitoring charts.',
    ),
    summary: l(
      'Migration d’un service de statistiques Elasticsearch vers CloudWatch Logs Insights et correction des dates.',
      'Migration of a statistics service from Elasticsearch to CloudWatch Logs Insights, with date-handling fixes.',
    ),
    role: l(
      'Développement backend et diagnostic',
      'Backend development and diagnostics',
    ),
    context: l(
      'Un service Lambda fournit les séries de connexions Wi-Fi affichées dans la supervision. J’ai fait évoluer sa source de données tout en préservant le format attendu par le frontend.',
      'A Lambda service provides the Wi-Fi connection series displayed in monitoring views. I changed its data source while preserving the format expected by the frontend.',
    ),
    challenge: l(
      'Conserver des séries horaires, journalières et mensuelles cohérentes malgré les intervalles absents et les cas limites de conversion à minuit.',
      'Keep hourly, daily and monthly series consistent despite missing intervals and midnight-conversion edge cases.',
    ),
    actions: [
      l(
        'Remplacé la source des agrégations Elasticsearch par CloudWatch Logs Insights pour ce service.',
        'Replaced Elasticsearch aggregations with CloudWatch Logs Insights for this service.',
      ),
      l(
        'Conservé le contrôle du périmètre client et adapté les séries au contrat de l’API.',
        'Preserved customer-scope checks and adapted series to the API contract.',
      ),
      l(
        'Complété les intervalles absents et corrigé la conversion lorsque Intl représente minuit par l’heure 24.',
        'Filled missing intervals and fixed conversion when Intl represents midnight as hour 24.',
      ),
    ],
    results: [
      l(
        'Des statistiques alimentées par CloudWatch et utilisables par les graphiques existants.',
        'CloudWatch-backed statistics usable by existing charts.',
      ),
      l(
        'Correction du cas « Invalid Date » identifié dans les conversions horaires.',
        'Fixed the identified “Invalid Date” edge case in time conversion.',
      ),
    ],
    note: l(
      'La migration concerne un service identifié, pas l’ensemble de l’infrastructure Elasticsearch. Aucun pourcentage d’économie n’a été établi.',
      'The migration covers one identified service, not the entire Elasticsearch infrastructure. No cost-saving percentage has been established.',
    ),
    stack: [
      'Node.js',
      'TypeScript',
      'AWS Lambda',
      'CloudWatch',
      'Elasticsearch',
    ],
    flow: [
      l('Logs Insights', 'Logs Insights'),
      l('Lambda / REST', 'Lambda / REST'),
      l('Graphiques web', 'Web charts'),
    ],
    lesson: l(
      'Les fuseaux horaires et les données manquantes doivent être traités dans le contrat de données, avant le rendu du graphique.',
      'Time zones and missing data should be handled in the data contract before chart rendering.',
    ),
  },
  {
    slug: 'edge-delivery',
    number: '05',
    name: l('Livraison applicative', 'Application delivery'),
    category: 'cloud',
    subtitle: l(
      'Mettre à jour chaque couche indépendamment.',
      'Update each application layer independently.',
    ),
    summary: l(
      'Versions frontend/backend séparées, runtime Docker stable et retour arrière via GitLab CI/CD.',
      'Separate frontend/backend releases, a stable Docker runtime and rollback through GitLab CI/CD.',
    ),
    role: l(
      'Automatisation CI/CD et intégration Linux',
      'CI/CD automation and Linux integration',
    ),
    context: l(
      'Les applications déployées sur Jetson combinent une base système spécifique et du code web qui évolue régulièrement. J’ai contribué à séparer ces cycles de livraison.',
      'Jetson applications combine a device-specific system base with frequently changing web code. I helped separate those delivery cycles.',
    ),
    challenge: l(
      'Mettre à jour une seule partie de l’application sans perdre l’autre, et pouvoir revenir à la version précédente en cas d’échec.',
      'Update one part of the application without losing the other, and restore the previous release if activation fails.',
    ),
    actions: [
      l(
        'Mis en place des archives de versions frontend/backend indépendantes de l’image Docker de base.',
        'Implemented frontend/backend release archives independent of the base Docker image.',
      ),
      l(
        'Préservé les fichiers de la partie inchangée pendant les déploiements partiels.',
        'Preserved unchanged application files during partial deployments.',
      ),
      l(
        'Intégré les contrôles, l’activation des versions et la restauration de la précédente dans les scripts de livraison.',
        'Integrated checks, release activation and restoration of the previous version into delivery scripts.',
      ),
      l(
        'Contribué aux pipelines GitLab et aux validations de livraison et de persistance après redémarrage.',
        'Contributed to GitLab pipelines and validation of releases and persistence after restart.',
      ),
    ],
    results: [
      l(
        'Frontend et backend peuvent être livrés indépendamment sans reconstruire le runtime de base.',
        'Frontend and backend can be delivered independently without rebuilding the base runtime.',
      ),
      l(
        'Un déploiement partiel conserve l’autre composant et dispose d’un mécanisme de retour arrière.',
        'A partial deployment preserves the other component and includes a rollback mechanism.',
      ),
    ],
    note: l(
      'Une modification des dépendances système peut toujours nécessiter la reconstruction de l’image de base. Aucun temps de déploiement non mesuré n’est annoncé.',
      'System-dependency changes may still require rebuilding the base image. No unmeasured deployment-time improvement is claimed.',
    ),
    stack: ['GitLab CI/CD', 'Docker', 'Linux', 'Bash', 'NVIDIA Jetson'],
    flow: [
      l('GitLab CI/CD', 'GitLab CI/CD'),
      l('Versions / contrôles', 'Releases / checks'),
      l('Jetson / rollback', 'Jetson / rollback'),
    ],
    lesson: l(
      'Séparer runtime et application rend les mises à jour plus ciblées ; le contrôle et le retour arrière doivent faire partie de la livraison.',
      'Separating runtime from application makes updates more targeted; validation and rollback should be part of delivery.',
    ),
  },
];

export const skills = [
  {
    title: l('Interfaces web', 'Web interfaces'),
    stack: ['React', 'TypeScript', 'JavaScript'],
    description: l(
      'Composants métier, configuration sur image caméra, graphiques et gestion des états de connexion.',
      'Application components, camera-image configuration, charts and connection-state handling.',
    ),
    project: 'securispot',
  },
  {
    title: l('API & services', 'APIs & services'),
    stack: ['Python', 'Flask', 'Node.js', 'REST'],
    description: l(
      'API embarquées et services Lambda ; extraction de données et génération de rapports PDF.',
      'Embedded APIs and Lambda services; data extraction and PDF report generation.',
    ),
    project: 'mediaspot',
  },
  {
    title: l('Cloud AWS', 'AWS cloud'),
    stack: ['Lambda', 'S3', 'DynamoDB', 'API Gateway', 'CloudWatch'],
    description: l(
      'Intégration de services, stockage, reporting planifié et diagnostic à partir des journaux.',
      'Service integration, storage, scheduled reporting and log-based diagnostics.',
    ),
    project: 'wifi-observability',
  },
  {
    title: l('Livraison logicielle', 'Software delivery'),
    stack: ['Docker', 'Git', 'GitLab CI/CD', 'Linux'],
    description: l(
      'Automatisation des versions applicatives, contrôles de livraison et mécanismes de retour arrière.',
      'Application-release automation, delivery checks and rollback mechanisms.',
    ),
    project: 'edge-delivery',
  },
  {
    title: l('Vision & edge', 'Vision & edge'),
    stack: ['OpenCV', 'YOLO / Ultralytics', 'TensorRT', 'NVIDIA Jetson'],
    description: l(
      'Intégration des modèles dans un produit, export des moteurs et exécution sur matériel embarqué.',
      'Model integration into a product, engine export and execution on edge hardware.',
    ),
    project: 'jetson-vision',
  },
  {
    title: l('Données & maintenance', 'Data & maintenance'),
    stack: ['Elasticsearch', 'CloudWatch Logs Insights', 'PHP', 'MySQL'],
    description: l(
      'Migration de statistiques et traitement des dates ; application métier PHP/MySQL durant mon stage chez KEOS.',
      'Statistics migration and date handling; a PHP/MySQL business application during my KEOS internship.',
    ),
    project: 'wifi-observability',
  },
];

export const experiences = [
  {
    company: 'Fastpoint',
    period: l('Sept. 2024 — aujourd’hui', 'Sep 2024 — present'),
    type: l('CDI · Caen', 'Permanent · Caen'),
    role: l('Ingénieur Full Stack', 'Full Stack Engineer'),
    description: l(
      'Applications web, services cloud et intégration de vision embarquée.',
      'Web applications, cloud services and embedded-vision integration.',
    ),
    achievements: [
      l(
        'Développé des interfaces React/TypeScript de configuration caméra et de supervision.',
        'Developed React/TypeScript interfaces for camera configuration and monitoring.',
      ),
      l(
        'Automatisé les rapports PDF mensuels MediaSpot avec Lambda, S3 et SES.',
        'Automated MediaSpot monthly PDF reports with Lambda, S3 and SES.',
      ),
      l(
        'Migré les statistiques Wi-Fi vers CloudWatch et corrigé les conversions de dates.',
        'Migrated Wi-Fi statistics to CloudWatch and fixed date conversion.',
      ),
      l(
        'Intégré YOLO/TensorRT au backend Python/Flask sur Jetson Orin.',
        'Integrated YOLO/TensorRT into the Python/Flask backend on Jetson Orin.',
      ),
      l(
        'Industrialisé les mises à jour frontend/backend indépendantes avec contrôles et retour arrière.',
        'Automated independent frontend/backend updates with checks and rollback.',
      ),
    ],
  },
  {
    company: 'KEOS Telecom',
    period: l('Juil. — déc. 2023', 'Jul — Dec 2023'),
    type: l('Stage · Paris', 'Internship · Paris'),
    role: l('Développeur web Full Stack', 'Full Stack Web Developer'),
    description: l(
      'Application métier interne pour les opérations télécom.',
      'An internal application for telecom operations.',
    ),
    achievements: [
      l(
        'Développé et maintenu des fonctionnalités en PHP/MySQL.',
        'Developed and maintained PHP/MySQL features.',
      ),
      l(
        'Corrigé des anomalies applicatives et des requêtes SQL.',
        'Fixed application issues and SQL queries.',
      ),
      l(
        'Documenté le fonctionnement de l’application pour sa maintenance.',
        'Documented application behavior to support maintenance.',
      ),
    ],
  },
  {
    company: 'HMRexpert',
    period: l('Fév. — juil. 2022', 'Feb — Jul 2022'),
    type: l(
      'Stage · Bourgogne-Franche-Comté',
      'Internship · Bourgogne-Franche-Comté',
    ),
    role: l(
      'Développeur logiciel & traitement d’image',
      'Software & Image Processing Developer',
    ),
    description: l(
      'Interface et traitements d’image sous Linux.',
      'User interface and image processing on Linux.',
    ),
    achievements: [
      l(
        'Développé une interface Qt et des modules OpenCV.',
        'Developed a Qt interface and OpenCV modules.',
      ),
      l(
        'Intégré, testé et documenté les traitements.',
        'Integrated, tested and documented the processing modules.',
      ),
    ],
  },
];
