import type IEntity from '../../entities/IEntity';
import type IDefensiveMove from '../../moves/defensive/IDefensiveMove';
import type IOffensiveMove from '../../moves/offensive/IOffensiveMove';
import {pickRandom} from '../../utils';

export function getTargetsExcludingTeam(
	self: IEntity,
	combatants: IEntity[],
	move: IOffensiveMove | IDefensiveMove,
	appliesToDead?: boolean,
	all = false,
) {
	const targets = combatants.filter(
		(combatant) =>
			combatant.isHero !== self.isHero &&
			!combatant.isNonTargetable &&
			!appliesToDead &&
			!combatant.isDead,
	);

	if (move.targetGroup === 'multiple') {
		return targets;
	}

	return all ? targets : [pickRandom(targets)].filter(Boolean);
}

export function getTargetsInOwnTeam(
	self: IEntity,
	combatants: IEntity[],
	move: IOffensiveMove | IDefensiveMove,
	appliesToDead?: boolean,
	all = false,
) {
	const targets = combatants.filter(
		(combatant) =>
			combatant.isHero === self.isHero && !combatant.isNonTargetable,
	);
	if (move.targetGroup === 'multiple') {
		return targets;
	}

	return all ? targets : [pickRandom(targets)].filter(Boolean);
}

export function getTargetsInOwnTeamExcludingSelf(
	self: IEntity,
	combatants: IEntity[],
	move: IOffensiveMove | IDefensiveMove,
	appliesToDead?: boolean,
	all = false,
) {
	const targets = combatants.filter(
		(combatant) =>
			combatant.isHero === self.isHero &&
			!combatant.isNonTargetable &&
			combatant.name !== self.name,
	);

	if (move.targetGroup === 'multiple') {
		return targets;
	}

	return all ? targets : [pickRandom(targets)].filter(Boolean);
}

function handleOffensiveMove(
	self: IEntity,
	combatants: IEntity[],
	move: IOffensiveMove | IDefensiveMove,
	appliesToDead?: boolean,
	all = false,
) {
	return getTargetsExcludingTeam(self, combatants, move, appliesToDead, all);
}

function handleDefensiveMove(
	self: IEntity,
	combatants: IEntity[],
	move: IOffensiveMove | IDefensiveMove,
	appliesToDead?: boolean,
	all = false,
) {
	if (move.target === 'self') {
		return [self];
	}

	return getTargetsInOwnTeam(self, combatants, move, appliesToDead, all);
}

export function getSingleTargetBasedOnMove(
	self: IEntity,
	combatants: IEntity[],
	move: IOffensiveMove | IDefensiveMove,
	appliesToDead = false,
) {
	return move.type === 'offensive'
		? handleOffensiveMove(self, combatants, move, appliesToDead)
		: handleDefensiveMove(self, combatants, move, appliesToDead);
}

export function getPossibleTargetsBasedOnMove(
	self: IEntity,
	combatants: IEntity[],
	move: IOffensiveMove | IDefensiveMove,
	appliesToDead = false,
) {
	return move.type === 'offensive'
		? handleOffensiveMove(self, combatants, move, appliesToDead)
		: handleDefensiveMove(self, combatants, move, appliesToDead);
}

export function getAllPossibleTargetsBasedOnMove(
	self: IEntity,
	combatants: IEntity[],
	move: IOffensiveMove | IDefensiveMove,
	appliesToDead = false,
) {
	return move.type === 'offensive'
		? handleOffensiveMove(self, combatants, move, appliesToDead, true)
		: handleDefensiveMove(self, combatants, move, appliesToDead, true);
}
