import Robot from '../entities/enemies/Robot';
import IArea from './IArea';

class Factory extends IArea {
	constructor() {
		super({
			name: 'Factory',
			enemySets: [[new Robot(), new Robot(), new Robot()]],
		});
	}
}

export default Factory;
