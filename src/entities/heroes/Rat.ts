import Shock from '../../moves/offensive/Shock';
import Punch from '../../moves/offensive/Punch';
import Barrage from '../../moves/offensive/Barrage';
import Hero from './IHero';

export default class Rat extends Hero {
	constructor() {
		super({
			name: 'Rat',
			availableMoves: [new Punch(), new Shock(), new Barrage()],
			maxHealth: 100,
			maxSpeed: 60,
			avatar: '/avatars/seed2283.png',
		});
	}
}
