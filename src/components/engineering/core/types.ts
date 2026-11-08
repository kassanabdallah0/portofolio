import type { RefObject } from 'react';
export type PhysicalScene = 'scan' | 'cloud' | 'vision' | 'delivery';
export type SceneView = 'physical' | 'architecture' | 'detail' | 'comparison';
export type SceneProps = {
  time: RefObject<number>;
  running: boolean;
  stage: number;
  selectedBus: number;
  view: SceneView;
  onSelectBus?: (index: number) => void;
};
