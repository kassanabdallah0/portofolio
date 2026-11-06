export type DemoType =
  'vision' | 'interface' | 'cloud' | 'delivery' | 'scan' | 'observability';
export const simulations: Record<
  DemoType,
  { title: string; stages: { name: string; explanation: string }[] }
> = {
  vision: {
    title: 'Voir. Suivre. Confirmer.',
    stages: [
      {
        name: 'Acquisition',
        explanation: 'La caméra fournit les images au calculateur embarqué.',
      },
      {
        name: 'Détection',
        explanation:
          'YOLO et TensorRT localisent les objets dans chaque image.',
      },
      {
        name: 'Suivi',
        explanation:
          'Le suivi conserve l’identité et la trajectoire de la personne.',
      },
      {
        name: 'Règle temporelle',
        explanation:
          'Plusieurs observations dans la zone confirment la condition.',
      },
      {
        name: 'Événement',
        explanation:
          'La condition confirmée déclenche un événement exploitable.',
      },
    ],
  },
  interface: {
    title: 'Une action. Tout un système.',
    stages: [
      {
        name: 'Interface React',
        explanation:
          'L’utilisateur règle la zone ou la sensibilité depuis son navigateur.',
      },
      {
        name: 'Requête REST',
        explanation:
          'La configuration est transmise à l’API sous une forme structurée.',
      },
      {
        name: 'API Flask',
        explanation: 'Le backend traite la configuration demandée.',
      },
      {
        name: 'Jetson',
        explanation:
          'La configuration est appliquée au système de vision embarqué.',
      },
      {
        name: 'Confirmation',
        explanation:
          'L’interface confirme la mise à jour. Ici, tout reste dans votre navigateur.',
      },
    ],
  },
  cloud: {
    title: 'Une flotte. Une infrastructure.',
    stages: [
      {
        name: 'Routeur du bus',
        explanation:
          'Le routeur Teltonika relie le bus à l’infrastructure distante.',
      },
      {
        name: 'OpenVPN · EC2',
        explanation:
          'Le tunnel VPN fournit un accès réseau sécurisé aux équipements.',
      },
      {
        name: 'Services · API',
        explanation:
          'Les API Node.js et les services AWS portent la logique applicative.',
      },
      {
        name: 'Portail · Rapports',
        explanation:
          'Le portail React sert les contenus ; les traitements AWS produisent les rapports.',
      },
    ],
  },
  delivery: {
    title: 'Avancer, avec un retour possible.',
    stages: [
      {
        name: 'Version Git',
        explanation: 'Un tag identifie la version du logiciel à construire.',
      },
      {
        name: 'Build · Tests',
        explanation:
          'La CI exécute les tests et publie les images dans GitLab Registry.',
      },
      {
        name: 'Validation Jetson',
        explanation:
          'Une commande locale déclenche le déploiement et les vérifications matérielles.',
      },
      {
        name: 'Activation',
        explanation: 'La nouvelle version est activée sur le calculateur.',
      },
      {
        name: 'État · Retour',
        explanation:
          'Les contrôles de santé valident la version ; sinon la version stable est restaurée.',
      },
    ],
  },
  scan: {
    title: 'Une expérience à hauteur d’utilisateur.',
    stages: [
      {
        name: 'Stabilisation',
        explanation: 'L’interface guide le positionnement avant l’acquisition.',
      },
      {
        name: 'Acquisition',
        explanation: 'Le backend orchestre le passage à l’étape de scan.',
      },
      {
        name: 'Validation',
        explanation:
          'Le résultat du détecteur, développé par un collègue, alimente le parcours.',
      },
      {
        name: 'Restitution',
        explanation:
          'React dans Chromium sur Jetson restitue le résultat sur la télévision via HDMI.',
      },
    ],
  },
  observability: {
    title: 'Des traces à la compréhension.',
    stages: [
      {
        name: 'Journaux',
        explanation:
          'Les applications produisent les traces utiles au diagnostic.',
      },
      {
        name: 'Logstash',
        explanation: 'L’ingestion prépare les événements pour leur indexation.',
      },
      {
        name: 'Elasticsearch',
        explanation:
          'Le cluster à trois nœuds conserve les données ; ILM applique une rétention de 180 jours.',
      },
      {
        name: 'Kibana · TLS',
        explanation:
          'Kibana permet l’exploration ; TLS protège les communications externes et entre nœuds.',
      },
    ],
  },
};

/** Closed trajectories and zero-opacity packet endpoints avoid visible resets. */
export const orbit = (time: number, offset = 0) => ({
  x: 330 + Math.cos(time * 0.23 + offset) * 208,
  y: 205 + Math.sin(time * 0.23 + offset) * 70,
  angle:
    (Math.atan2(
      Math.cos(time * 0.23 + offset) * 70,
      -Math.sin(time * 0.23 + offset) * 208,
    ) *
      180) /
    Math.PI,
});
