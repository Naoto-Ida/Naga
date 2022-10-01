import {describe, it, expect} from 'vitest';
import Punch from '../../moves/offensive/Punch';
import Adrenaline from '../../moves/defensive/Adrenaline';
import {DEFAULT_SPEED} from '../defaultValues';
import IEntity from '../IEntity';

describe('IEntity', () => {
	class Foo extends IEntity {
		isHero = true;

		constructor() {
			super({name: 'Foo', maxHealth: 100});
		}
	}

	it('returns currentHealth', () => {
		expect(new Foo().currentHealth).toBe(100);
	});

	it('returns speed', () => {
		expect(new Foo().maxSpeed).toBe(DEFAULT_SPEED);
	});

	it.only('handles applying status', () => {
		const foo = new Foo();
		foo.addParalysisStatus();

		expect(foo.statuses.paralyzed).toBeTruthy();
		expect(foo.statuses.paralyzed!.current).toBe(0);

		const foo2 = new Foo();
		foo2.addPoisonStatus();

		expect(foo2.statuses.poisoned).toBeTruthy();
		expect(foo2.statuses.poisoned!.current).toBe(0);
	});

	it('handles damage', () => {
		const foo = new Foo();
		const move = new Punch();

		foo.handleMove(move);

		expect(foo.currentHealth).toEqual(50);
	});

	it('applies positive status to self', () => {
		const foo = new Foo();
		const move = new Adrenaline();

		foo.handleMove(move);

		expect(foo.statuses).toEqual(['juiced']);
		expect(foo.currentSpeed.toFixed(0)).toEqual('55');
	});
});
