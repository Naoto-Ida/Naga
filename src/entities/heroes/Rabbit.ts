import Vanish from '../../moves/defensive/Vanish';
import Kick from '../../moves/offensive/Kick';
import Snipe from '../../moves/offensive/Snipe';
import Hero from './IHero';

export default class Rabbit extends Hero {
	constructor() {
		super({
			name: 'Rabbit',
			maxHealth: 60,
			maxSpeed: 120,
			availableMoves: [new Kick(), new Snipe(), new Vanish()],
			avatar: '/avatars/seed4262.png',
		});
	}
}
