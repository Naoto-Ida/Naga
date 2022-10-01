import Punch from '../moves/offensive/Punch';
import type IOffensiveMove from '../moves/offensive/IOffensiveMove';

export const DEFAULT_HEALTH = 100;
export const DEFAULT_SPEED = 50;
export const DEFAULT_AVAILABLE_MOVES: IOffensiveMove[] = [new Punch()];
export const DEFAULT_IS_DEAD = false;
