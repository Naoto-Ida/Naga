import IOffensiveMove from './IOffensiveMove';

export default class Punch extends IOffensiveMove {
	constructor() {
		super({
			name: 'Punch',
			description: 'Test',
			category: 'magic',
			rawDamageValue: 50,
		});
	}
}
