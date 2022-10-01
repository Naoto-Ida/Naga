import IDefensiveMove from './IDefensiveMove';

export default class Vanish extends IDefensiveMove {
	constructor() {
		super({
			name: 'Vanish',
			description: 'Become invisible for one turn.',
			category: 'physical',
			statusEffects: ['nonTargetable'],
			target: 'self',
		});
	}
}
