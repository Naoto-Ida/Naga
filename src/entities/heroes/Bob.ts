import Hero from './IHero';

export default class Bob extends Hero {
	constructor() {
		super({name: 'Bob', maxHealth: 100, maxSpeed: 60});
	}
}
