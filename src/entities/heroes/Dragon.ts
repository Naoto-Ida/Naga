import Flamethrower from '../../moves/offensive/Flamethrower';
import Tackle from '../../moves/offensive/Tackle';
import Hero from './IHero';

export default class Dragon extends Hero {
	constructor() {
		super({
			name: 'Dragon',
			maxHealth: 100,
			maxSpeed: 60,
			availableMoves: [new Tackle(), new Flamethrower()],
		});
	}
}
