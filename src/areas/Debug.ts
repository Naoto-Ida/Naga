import Robot from '../entities/enemies/Robot';
import IArea from './IArea';

class Debug extends IArea {
	constructor() {
		super({
			name: 'Debug',
			enemySets: [[new Robot(), new Robot(), new Robot()]],
		});
	}
}

export default Debug;
