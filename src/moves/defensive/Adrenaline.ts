import IDefensiveMove from './IDefensiveMove';

export default class Adrenaline extends IDefensiveMove {
	constructor() {
		super({
			name: 'Adrenaline',
			description: 'Test',
			category: 'physical',
			statusEffects: ['juiced'],
		});
	}
}
