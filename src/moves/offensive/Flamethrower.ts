import IOffensiveMove from './IOffensiveMove';

export default class Flamethrower extends IOffensiveMove {
	constructor() {
		super({
			name: 'Flamethrower',
			description: 'Test',
			category: 'magic',
			element: 'fire',
			rawDamageValue: 30,
		});
	}
}
