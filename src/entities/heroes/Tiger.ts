import OiledClaws from '../../moves/offensive/OiledClaws';
import Tackle from '../../moves/offensive/Tackle';
import Hero from './IHero';

export default class Tiger extends Hero {
	constructor() {
		super({
			name: 'Tiger',
			maxHealth: 80,
			maxSpeed: 100,
			availableMoves: [new Tackle(), new OiledClaws()],
		});
	}
}
