import IOffensiveMove from './IOffensiveMove';

export default class Tackle extends IOffensiveMove {
	constructor() {
		super({
			name: 'Tackle',
			description: 'Test',
			category: 'physical',
			rawDamageValue: 70,
		});
	}
}
