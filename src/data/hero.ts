export type HeroLayer = 'interface' | 'backend' | 'production';
export type HeroProject = 'securispot' | 'mediaspot';

export const heroLayers: {
  id: HeroLayer;
  label: string;
  explanation: string;
}[] = [
  {
    id: 'interface',
    label: 'Interfaces',
    explanation:
      'Je conçois les parcours et les interfaces React qui rendent les produits utilisables.',
  },
  {
    id: 'backend',
    label: 'API & Backend',
    explanation:
      'Je développe les API et la logique métier en Python/Flask et Node.js/TypeScript.',
  },
  {
    id: 'production',
    label: 'Cloud & Edge',
    explanation:
      'Je déploie, maintiens et fais évoluer les logiciels sur AWS et sur les équipements Jetson.',
  },
];
