import React from 'react';
import { getCustom98GameByModuleId } from '../../data/custom98Games';
import { ArcadeShell } from './ArcadeShell';
import { ArenaDefenseGame } from './ArenaDefenseGame';
import { TacticalGridGame } from './TacticalGridGame';
import { ActionPhysicsGame } from './ActionPhysicsGame';
import { GeometryLaserGame } from './GeometryLaserGame';
import { BalancerCipherTycoonGame } from './BalancerCipherTycoonGame';

interface Custom98GamesProps {
  moduleId: string;
  onAddGamePoints?: (points: number) => void;
  onGoToQuiz?: () => void;
}

export const Custom98Games: React.FC<Custom98GamesProps> = ({
  moduleId,
  onAddGamePoints,
  onGoToQuiz,
}) => {
  const spec = getCustom98GameByModuleId(moduleId);
  if (!spec) {
    return null;
  }

  return (
    <ArcadeShell spec={spec} onAddGamePoints={onAddGamePoints} onGoToQuiz={onGoToQuiz}>
      {(runtime) => {
        switch (spec.family) {
          case 'arena-defense':
            return <ArenaDefenseGame spec={spec} runtime={runtime} />;
          case 'tactical-grid':
            return <TacticalGridGame spec={spec} runtime={runtime} />;
          case 'action-physics':
            return <ActionPhysicsGame spec={spec} runtime={runtime} />;
          case 'geometry-laser':
            return <GeometryLaserGame spec={spec} runtime={runtime} />;
          case 'balancer-cipher-tycoon':
          default:
            return <BalancerCipherTycoonGame spec={spec} runtime={runtime} />;
        }
      }}
    </ArcadeShell>
  );
};
