import type IEntity from '../../entities/IEntity';
import {MULTIPLIER} from '../multipliers';

function sortCombatants(combatants: IEntity[]) {
	return combatants.sort((a, b) => {
		const firstSpeed = applyStatusToSpeed(a);
		const secondSpeed = applyStatusToSpeed(b);
		if (firstSpeed < secondSpeed) {
			return 1;
		}

		return -1;
	});
}

function applyStatusToSpeed(combatant: IEntity) {
	if (combatant.isParalyzed) {
		return combatant.maxSpeed * MULTIPLIER.PARALYZED_SPEED;
	}

	return combatant.maxSpeed;
}

export default sortCombatants;
