import Adrenaline from '../../moves/defensive/Adrenaline';
import Kick from '../../moves/offensive/Kick';
import Hero from './IHero';

export default class Horse extends Hero {
	constructor() {
		super({
			name: 'Horse',
			maxHealth: 80,
			maxSpeed: 80,
			availableMoves: [new Kick(), new Adrenaline()],
		});
	}
}
