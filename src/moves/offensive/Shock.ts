import IOffensiveMove from './IOffensiveMove';

export default class Shock extends IOffensiveMove {
	constructor() {
		super({
			name: 'Shock',
			description:
				'Shocks enemy with electric baton and afflicts with paralysis.',
			category: 'magic',
			statusEffects: ['paralyzed'],
			rawDamageValue: 20,
		});
	}
}
