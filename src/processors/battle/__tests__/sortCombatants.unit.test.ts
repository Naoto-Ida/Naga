import {describe, it, expect} from 'vitest';
import {v1 as uuid} from 'uuid';

import Enemy from '../../../entities/enemies/IEnemy';
import Hero from '../../../entities/heroes/IHero';
import sortCombatants from '../sortCombatants';
import type {Combatants} from '../types';

describe('sortCombatants', () => {
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
		const enemy = new Bar();

		return {
			hero,
			enemy,
		};
	};

	it('sorts by pure speed', async () => {
		const {hero, enemy} = initialize();

		const heroId = uuid();
		const enemyId = uuid();

		const combatants: Combatants = {
			[enemyId]: enemy,
			[heroId]: hero,
		};

		const sorted = sortCombatants(combatants);

		expect(Object.entries(sorted).findIndex(([id]) => id === heroId)).toEqual(
			0,
		);
	});

	it('sorts with status', async () => {
		const {hero, enemy} = initialize();

		hero.addParalysisStatus();

		const heroId = uuid();
		const enemyId = uuid();

		const combatants: Combatants = {
			[enemyId]: enemy,
			[heroId]: hero,
		};

		const sorted = sortCombatants(combatants);

		expect(Object.entries(sorted).findIndex(([id]) => id === heroId)).toEqual(
			1,
		);
	});
});
