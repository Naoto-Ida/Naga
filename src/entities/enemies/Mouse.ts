import IEnemy from './IEnemy';

export default class Mouse extends IEnemy {
	constructor() {
		super({name: 'Mouse', archetype: 'augmented', maxHealth: 60});
	}
}
