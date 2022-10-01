import type {EntityStatus} from '../../entities/types';
import {DEFAULT_CATEGORY} from '../defaultValues';
import IMove, {type MoveConstructor} from '../IMove';
import type {MoveTarget} from '../types';

type IOffensiveMoveConstructor = Omit<MoveConstructor, 'type' | 'target'> & {
	rawDamageValue: number;
	statusEffects?: EntityStatus[];
	target?: MoveTarget;
};

abstract class IOffensiveMove extends IMove {
	private _rawDamageValue: number;
	private readonly _statusEffects: EntityStatus[];

	constructor({
		name,
		description,
		rawDamageValue,
		category = DEFAULT_CATEGORY,
		target = 'enemy',
		targetGroup,
		statusEffects = [],
	}: IOffensiveMoveConstructor) {
		super({
			name,
			description,
			category,
			type: 'offensive',
			target,
			targetGroup,
		});

		this._rawDamageValue = rawDamageValue;

		this._statusEffects = statusEffects;
	}

	get rawDamageValue() {
		return this._rawDamageValue;
	}

	set rawDamageValue(value: number) {
		this._rawDamageValue = value;
	}

	get statusEffects() {
		return this._statusEffects;
	}
}

export default IOffensiveMove;
