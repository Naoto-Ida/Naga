import Mouse from '../entities/enemies/Mouse';
import ScrapDog from '../entities/enemies/ScrapDog';
import IArea from './IArea';

class Slum extends IArea {
	constructor() {
		const enemySets = [[new Mouse(), new ScrapDog(), new ScrapDog()]];

		super({name: 'Slum', enemySets});
	}
}

export default Slum;
