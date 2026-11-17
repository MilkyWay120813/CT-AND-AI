import React from 'react';
import { Part1NumberSimulators } from './Part1NumberSimulators';
import { Part1ShapeLogicSimulators } from './Part1ShapeLogicSimulators';
import { Part2PercentPythPropSimulators } from './Part2PercentPythPropSimulators';
import { Part2GeoDataAlgAreaSimulators } from './Part2GeoDataAlgAreaSimulators';

interface Custom98SimulationsProps {
  moduleId: string;
  simA: number;
  simB: number;
}

export const Custom98Simulations: React.FC<Custom98SimulationsProps> = ({
  moduleId,
  simA,
  simB,
}) => {
  // Part I Ch 1–3
  if (
    moduleId.startsWith('mod-1-') ||
    moduleId.startsWith('mod-2-') ||
    moduleId.startsWith('mod-3-')
  ) {
    return <Part1NumberSimulators moduleId={moduleId} simA={simA} simB={simB} />;
  }

  // Part I Ch 4–7
  if (
    moduleId.startsWith('mod-4-') ||
    moduleId.startsWith('mod-5-') ||
    moduleId.startsWith('mod-6-') ||
    moduleId.startsWith('mod-7-')
  ) {
    return <Part1ShapeLogicSimulators moduleId={moduleId} simA={simA} simB={simB} />;
  }

  // Part II Ch 1–3
  if (
    moduleId.startsWith('p2-mod-1-') ||
    moduleId.startsWith('p2-mod-2-') ||
    moduleId.startsWith('p2-mod-3-')
  ) {
    return (
      <Part2PercentPythPropSimulators moduleId={moduleId} simA={simA} simB={simB} />
    );
  }

  // Part II Ch 4–7
  return (
    <Part2GeoDataAlgAreaSimulators moduleId={moduleId} simA={simA} simB={simB} />
  );
};
