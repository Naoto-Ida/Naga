import OiledClaws from '../../moves/offensive/OiledClaws';
import Tackle from '../../moves/offensive/Tackle';
import Hero from './IHero';

export default class Monkey extends Hero {
	constructor() {
		super({
			name: 'Monkey',
			maxHealth: 90,
			maxSpeed: 60,
			availableMoves: [new Tackle(), new OiledClaws()],
		});
	}
}
