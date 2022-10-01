import type IMove from '../moves/IMove';

export type EntityStatusPositive =
	| 'juiced'
	| 'repaired'
	| 'nonTargetable'
	| 'guarded';

export type EntityStatus =
	| 'paralyzed'
	| 'poisoned'
	| 'oiled'
	| 'jammed'
	| EntityStatusPositive;
export type EntityArchetype = 'pure' | 'augmented' | 'android' | 'mech';

export type EntityStatus2 = {
	type: EntityStatus;
	description: string;
	duration: number;
	current: number;
};

type TargetReceivedMove = {
	isSuccessful: boolean;
	move: IMove;
};
