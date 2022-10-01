import IOffensiveMove from './IOffensiveMove';

export default class OiledClaws extends IOffensiveMove {
	constructor() {
		super({
			name: 'OiledClaws',
			description: 'Test',
			category: 'physical',
			rawDamageValue: 50,
			statusEffects: ['oiled'],
		});
	}
}
