import Guard from '../../moves/defensive/Guard';
import Tackle from '../../moves/offensive/Tackle';
import Hero from './IHero';

export default class Ox extends Hero {
	constructor() {
		super({
			name: 'Ox',
			maxHealth: 120,
			maxSpeed: 40,
			availableMoves: [new Tackle(), new Guard()],
		});
	}
}
