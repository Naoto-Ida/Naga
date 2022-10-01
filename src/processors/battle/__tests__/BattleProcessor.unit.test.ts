import {describe, it, expect} from 'vitest';

import Enemy from '../../../entities/enemies/IEnemy';
import Hero from '../../../entities/heroes/IHero';
import Adrenaline from '../../../moves/defensive/Adrenaline';
import BattleProcessor from '../BattleProcessor';

describe('BattleProcessor', () => {
	class Foo extends Hero {
		constructor() {
			super({name: 'Foo', maxHealth: 100});
		}
	}

	class Bar extends Enemy {
		constructor() {
			super({name: 'Bar', maxHealth: 80});
		}
	}

	const initialize = () => {
		const tp = new BattleProcessor();
		const hero = new Foo();
		const enemy = new Bar();
		const supportEnemy = new Bar();

		supportEnemy.name = 'Bar2';

		supportEnemy.availableMoves = [
			...supportEnemy.availableMoves,
			new Adrenaline(),
		];

		return {
			tp,
			hero,
			enemy,
			enemy2: supportEnemy,
		};
	};

	it('returns BattleResultType forfeit', async () => {
		const {tp} = initialize();

		const results = await tp.init([]);

		expect(results.type).toEqual('forfeit');
	});

	it('returns BattleResultType victory', async () => {
		const {tp, hero, enemy} = initialize();

		const result = await tp.init([hero, enemy], {isDebug: false});

		expect(result.type).toEqual('victory');
	});

	it('returns BattleResultType defeat', async () => {
		const {tp, hero, enemy} = initialize();
		hero.maxSpeed = 10;

		const result = await tp.init([hero, enemy], {isDebug: false});

		expect(result.type).toEqual('defeat');
	});

	it('handles multiple enemies', async () => {
		const {tp, hero, enemy, enemy2} = initialize();

		const result = await tp.init([hero, enemy, enemy2], {isDebug: true});

		console.log(result.combatants.find((v) => v.isJuiced));

		expect(result.type).toBe('defeat');
	});

	it.only('turn', async () => {
		const {tp, hero, enemy, enemy2} = initialize();

		const result = await tp.init([hero, enemy, enemy2], {isDebug: true});
	});
});
