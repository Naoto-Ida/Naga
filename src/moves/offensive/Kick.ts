import IOffensiveMove from './IOffensiveMove';

export default class Kick extends IOffensiveMove {
	constructor() {
		super({
			name: 'Kick',
			description: 'Kicks enemy',
			category: 'physical',
			rawDamageValue: 30,
		});
	}
}
