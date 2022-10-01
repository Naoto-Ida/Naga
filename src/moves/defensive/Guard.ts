import IDefensiveMove from './IDefensiveMove';

export default class Guard extends IDefensiveMove {
	constructor() {
		super({
			name: 'Guard',
			description: 'Test',
			category: 'physical',
			statusEffects: ['guarded'],
			target: 'self',
		});
	}
}
