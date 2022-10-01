import {describe, it, expect} from 'vitest';
import Hero from '../heroes/IHero';
import {getImmunities} from '../utils';

describe('utils', () => {
	describe('getImmunities', () => {
		it('returns immunities for "mech"', () => {
			class Mech extends Hero {
				constructor() {
					super({name: 'Mech', archetype: 'mech', maxHealth: 100});
				}
			}

			expect(getImmunities(new Mech())).toEqual(['poisoned']);
		});

		it('returns immunities for "pure"', () => {
			class Pure extends Hero {
				constructor() {
					super({name: 'Pure', archetype: 'pure', maxHealth: 100});
				}
			}

			expect(getImmunities(new Pure())).toEqual(['jammed']);
		});
	});
});
