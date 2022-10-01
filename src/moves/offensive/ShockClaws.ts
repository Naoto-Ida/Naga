import IOffensiveMove from './IOffensiveMove';

export default class ShockClaws extends IOffensiveMove {
	constructor() {
		super({
			name: 'Shock Claws',
			description:
				'Shocks enemy with electric claws and afflicts with paralysis.',
			category: 'physical',
			statusEffects: ['paralyzed'],
			rawDamageValue: 10,
		});
	}
}
