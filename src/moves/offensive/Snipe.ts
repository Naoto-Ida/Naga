import IOffensiveMove from './IOffensiveMove';

export default class Snipe extends IOffensiveMove {
	constructor() {
		super({
			name: 'Snipe',
			description: 'Test',
			category: 'physical',
			rawDamageValue: 90,
			accuracy: 0.95,
		});
	}
}
