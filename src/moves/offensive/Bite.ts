import IOffensiveMove from './IOffensiveMove';

export default class Bite extends IOffensiveMove {
	constructor() {
		super({
			name: 'Bite',
			description: 'Bites enemy',
			category: 'physical',
			rawDamageValue: 60,
		});
	}
}
