import Bite from '../../moves/offensive/Bite';
import ShockClaws from '../../moves/offensive/ShockClaws';
import IEnemy from './IEnemy';

export default class ScrapDog extends IEnemy {
	constructor() {
		super({
			name: 'Scrap Dog',
			archetype: 'mech',
			maxHealth: 60,
			availableMoves: [new ShockClaws(), new Bite()],
		});
	}
}
