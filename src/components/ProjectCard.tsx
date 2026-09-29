import { ArrowUpRight, ArrowRight, Code2, Cloud, Cpu } from 'lucide-react';
import { usePreferences } from '@/context/preferences';
import { Tags } from '@/components/Site';
import type { Project } from '@/data/portfolio';

export function ProjectVisual({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  const { language } = usePreferences();
  const Icon =
    project.category === 'edge'
      ? Cpu
      : project.category === 'cloud'
        ? Cloud
        : Code2;
  return (
    <div
      className={`project-visual ${large ? 'large' : ''}`}
      aria-hidden="true"
    >
      <div className="visual-topline">
        <span>{project.name[language]}</span>
        <span>
          {language === 'fr' ? 'SCHÉMA SIMPLIFIÉ' : 'SIMPLIFIED DIAGRAM'}
        </span>
      </div>
      <div className="flow-diagram">
        {project.flow.map((step, i) => (
          <div className="flow-step" key={step.en}>
            <div className="flow-node">
              {i === 1 ? (
                <Icon size={25} />
              ) : (
                <span className="flow-index">0{i + 1}</span>
              )}
              <span>{step[language]}</span>
            </div>
            {i < project.flow.length - 1 && (
              <ArrowRight size={20} className="flow-arrow" />
            )}
          </div>
        ))}
      </div>
      <div className="visual-bottomline">
        <span className="status-dot" />
        FASTPOINT <span className="visual-number">/{project.number}</span>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { language } = usePreferences();
  return (
    <article className="project-card">
      <ProjectVisual project={project} />
      <div className="project-card-content">
        <div className="project-title">
          <h3>
            <a href={`#/projects/${project.slug}`}>{project.name[language]}</a>
          </h3>
          <ArrowUpRight size={22} aria-hidden="true" />
        </div>
        <p>{project.summary[language]}</p>
        <Tags items={project.stack.slice(0, 4)} />
        <a className="text-link" href={`#/projects/${project.slug}`}>
          {language === 'fr' ? 'Lire l’étude de cas' : 'Read the case study'}
          <ArrowRight size={16} aria-hidden="true" />
          <span className="sr-only"> — {project.name[language]}</span>
        </a>
      </div>
    </article>
  );
}
