import IOffensiveMove from './IOffensiveMove';

export default class Barrage extends IOffensiveMove {
	constructor() {
		super({
			name: 'Barrage',
			description: 'Fires weapons.',
			category: 'physical',
			rawDamageValue: 30,
			targetGroup: 'multiple',
		});
	}
}
