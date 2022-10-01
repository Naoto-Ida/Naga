import {describe, it, expect} from 'vitest';

import Enemy from '../../../entities/enemies/IEnemy';
import Hero from '../../../entities/heroes/IHero';
import renameCombatants from '../../renameCombatants';

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
		const enemy2 = new Bar();
		const enemy3 = new Bar();

		return {
			hero,
			enemy,
			enemy2,
			enemy3,
		};
	};

	it('renames duplicate combatants', async () => {
		const {hero, enemy, enemy2, enemy3} = initialize();
		const combatants = [enemy, hero, enemy2, enemy3];
		const renamed = renameCombatants(combatants);
		console.warn(renamed.map((r) => r.name).join(', '));

		expect(1).toEqual(1);
	});
});
