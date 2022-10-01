import {describe, it, expect} from 'vitest';
import * as Pixi from 'pixi.js';

import BattleScene from '../BattleScene';

describe('BattleScene', () => {
	it('starts', async () => {
		const app = new Pixi.Application();
		const bs = new BattleScene(app);
		const result = await bs.init({battleConfig: {isDebug: true}});

		expect(result.type).not.toBeFalsy();
	});
});
