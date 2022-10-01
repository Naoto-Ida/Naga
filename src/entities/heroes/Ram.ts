import Guard from '../../moves/defensive/Guard';
import Tackle from '../../moves/offensive/Tackle';
import Hero from './IHero';

export default class Ram extends Hero {
	constructor() {
		super({
			name: 'Ram',
			maxHealth: 100,
			maxSpeed: 50,
			availableMoves: [new Tackle(), new Guard()],
		});
	}
}
