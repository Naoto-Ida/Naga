import type IEntity from './IEntity';
import type {EntityStatus} from './types';

export function getImmunities(target: IEntity): EntityStatus[] {
	switch (target.archetype) {
		case 'android':
			return ['poisoned'];
		case 'augmented':
			return [];
		case 'mech':
			return ['poisoned'];
		default:
			return ['jammed'];
	}
}
