import type IEnemy from '../entities/enemies/IEnemy';
import {pickRandom} from '../utils';
import data from '../layers/iarea.json';

export type IAreaConstructor = {
	name: string;
	enemySets: IEnemy[][];
	layers?: number[];
};

abstract class IArea {
	private readonly _name: string;
	private readonly _enemySets: IEnemy[][];

	constructor({name, enemySets = [[]], layers = data}: IAreaConstructor) {
		this._name = name;

		for (const enemySet of enemySets) {
			if (enemySet.length > 3) {
				throw new Error('You cannot have more than 3 enemies in one set.');
			}
		}

		this._enemySets = enemySets;
	}

	get name() {
		return this._name;
	}

	get enemySets() {
		return this._enemySets;
	}

	get enemySet() {
		return pickRandom(this._enemySets);
	}
}

export default IArea;
