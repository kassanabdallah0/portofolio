import type { SceneView } from '../core/types';

const stories = [
  {
    title: 'Wi-Fi local',
    path: 'Téléphone → Teltonika RUTX11',
    note: 'Le portail passager commence à bord.',
  },
  {
    title: 'Accès distant sécurisé',
    path: 'Cellulaire → OpenVPN sur EC2',
    note: 'Client RUTX11 · authentification par certificats.',
  },
  {
    title: 'Contenus applicatifs',
    path: 'API Gateway → Lambda · Node/TS → S3',
    note: 'Flux applicatif distinct du tunnel de gestion.',
  },
  {
    title: 'Rapport mensuel',
    path: 'EventBridge → Lambda → SES',
    note: 'CloudWatch fournit les journaux à agréger.',
  },
];

export function FleetOverlay({
  stage,
  selectedBus,
  view,
}: {
  stage: number;
  selectedBus: number;
  view: SceneView;
}) {
  const story = stories[stage % stories.length];
  return (
    <div className="fleet-context" data-fleet-view={view}>
      <span className="fleet-context-identity">
        BUS {String.fromCharCode(65 + selectedBus)} <i /> SCÉNARIO ILLUSTRATIF
      </span>
      <strong>{story.title}</strong>
      <span>{story.path}</span>
      <small>{story.note}</small>
    </div>
  );
}
