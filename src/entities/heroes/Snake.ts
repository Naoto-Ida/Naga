import Guard from '../../moves/defensive/Guard';
import Bite from '../../moves/offensive/Bite';
import Hero from './IHero';

export default class Snake extends Hero {
	constructor() {
		super({
			name: 'Snake',
			maxHealth: 70,
			maxSpeed: 90,
			availableMoves: [new Bite(), new Guard()],
		});
	}
}
