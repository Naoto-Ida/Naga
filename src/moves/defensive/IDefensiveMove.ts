import type {EntityStatus} from '../../entities/types';
import {DEFAULT_CATEGORY} from '../defaultValues';
import IMove, {type MoveConstructor} from '../IMove';
import type {MoveTarget} from '../types';

type IDefensiveMoveConstructor = Omit<MoveConstructor, 'type' | 'target'> & {
	statusEffects?: EntityStatus[];
	target?: MoveTarget;
};

abstract class IDefensiveMove extends IMove {
	private readonly _statusEffects: EntityStatus[];

	constructor({
		name,
		description,
		category = DEFAULT_CATEGORY,
		target = 'team',
		targetGroup,
		statusEffects = [],
	}: IDefensiveMoveConstructor) {
		super({
			name,
			description,
			category,
			type: 'defensive',
			target,
			targetGroup,
		});

		this._statusEffects = statusEffects;
	}

	get statusEffects() {
		return this._statusEffects;
	}
}

export default IDefensiveMove;
