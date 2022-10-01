import IEnemy from './IEnemy';

export default class Robot extends IEnemy {
	constructor() {
		super({name: 'Robot', archetype: 'mech', maxHealth: 80});
	}
}
