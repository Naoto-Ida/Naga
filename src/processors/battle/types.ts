import type IEntity from '../../entities/IEntity';
import type IMove from '../../moves/IMove';

export type Combatants = Record<string, IEntity>;

export type BattleResultType = 'victory' | 'defeat' | 'forfeit';

export type BattleResult = {
	type: BattleResultType;
	combatants: IEntity[];
};

export type ProcessedTurn = {
	move?: IMove;
	belligerent: {
		combatant: IEntity;
		targets: IEntity[];
	};
};
