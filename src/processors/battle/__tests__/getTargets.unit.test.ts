import {describe, it, expect} from 'vitest';

import Enemy from '../../../entities/enemies/IEnemy';
import Hero from '../../../entities/heroes/IHero';
import {
	getPossibleTargetsBasedOnMove,
	getTargetsExcludingTeam,
	getTargetsInOwnTeam,
	getTargetsInOwnTeamExcludingSelf,
} from '../getTargets';
import Punch from '../../../moves/offensive/Punch';
import Barrage from '../../../moves/offensive/Barrage';

describe('getTargets', () => {
	class Foo extends Hero {
		constructor() {
			super({name: 'Foo', maxHealth: 100, maxSpeed: 100});
		}
	}

	class Bar extends Enemy {
		constructor() {
			super({name: 'Bar', maxHealth: 80, maxSpeed: 90});
		}
	}

	const initialize = () => {
		const hero = new Foo();
		const hero2 = new Foo();
		const enemy = new Bar();
		const enemy2 = new Bar();
		enemy2.name = 'Bar2';

		return {
			hero,
			hero2,
			enemy,
			enemy2,
		};
	};

	it('getTargetsExcludingTeam', () => {
		const {hero, enemy, enemy2} = initialize();
		const combatants = [hero, enemy, enemy2];
		const move = new Punch();

		expect(getTargetsExcludingTeam(hero, combatants, move).length).toEqual(1);
		expect(getTargetsExcludingTeam(enemy, combatants, move).length).toEqual(1);
		expect(getTargetsExcludingTeam(enemy2, combatants, move).length).toEqual(1);
	});

	it('getTargetsInOwnTeam', () => {
		const {hero, enemy, enemy2} = initialize();
		const combatants = [hero, enemy, enemy2];
		const move = new Punch();

		expect(getTargetsInOwnTeam(hero, combatants, move).length).toEqual(1);
		expect(getTargetsInOwnTeam(enemy, combatants, move).length).toEqual(1);
		expect(getTargetsInOwnTeam(enemy2, combatants, move).length).toEqual(1);
	});

	it('getTargetsInOwnTeamExcludingSelf', () => {
		const {hero, enemy, enemy2} = initialize();
		const combatants = [hero, enemy, enemy2];
		const move = new Punch();

		expect(
			getTargetsInOwnTeamExcludingSelf(hero, combatants, move).length,
		).toEqual(0);
		expect(
			getTargetsInOwnTeamExcludingSelf(enemy, combatants, move).length,
		).toEqual(1);
		expect(
			getTargetsInOwnTeamExcludingSelf(enemy2, combatants, move).length,
		).toEqual(1);
	});

	describe('getPossibleTargetsBasedOnMove', () => {
		it('handles single-targeting move', () => {
			const {hero, enemy, enemy2} = initialize();
			const combatants = [hero, enemy, enemy2];
			const move = new Punch();

			expect(
				getPossibleTargetsBasedOnMove(hero, combatants, move).length,
			).toEqual(1);
			expect(
				getPossibleTargetsBasedOnMove(enemy, combatants, move).length,
			).toEqual(1);
			expect(
				getPossibleTargetsBasedOnMove(enemy2, combatants, move).length,
			).toEqual(1);
		});

		it('handles a multi-targeting move', () => {
			const {hero, hero2, enemy, enemy2} = initialize();
			const combatants = [hero, hero2, enemy, enemy2];
			const move = new Barrage();

			expect(
				getPossibleTargetsBasedOnMove(hero, combatants, move).length,
			).toEqual(2);
			expect(
				getPossibleTargetsBasedOnMove(enemy, combatants, move).length,
			).toEqual(2);
			expect(
				getPossibleTargetsBasedOnMove(enemy2, combatants, move).length,
			).toEqual(2);
		});
	});
});
