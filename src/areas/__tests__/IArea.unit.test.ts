import {describe, it, expect} from 'vitest';
import Robot from '../../entities/enemies/Robot';
import ScrapDog from '../../entities/enemies/ScrapDog';
import IArea from '../IArea';

describe('IArea', () => {
	const init = () => {
		const enemySets = [[new ScrapDog(), new ScrapDog()], [new Robot()]];

		class NewArea extends IArea {
			constructor() {
				super({name: 'New Area', enemySets});
			}
		}

		return {
			area: new NewArea(),
			enemySets,
		};
	};

	it('sets enemySets', () => {
		const {area, enemySets} = init();

		expect(area.enemySets).toEqual(enemySets);
		expect(area.enemySet.length).toBeGreaterThan(0);
	});
});
