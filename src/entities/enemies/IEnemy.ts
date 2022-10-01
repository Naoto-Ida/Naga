import IEntity, {type EntityConstructor} from '../IEntity';

abstract class IEnemy extends IEntity {
	isHero = false;

	constructor(args: EntityConstructor) {
		super({...args, avatar: '/avatars/seed2575.png'});
	}
}

export default IEnemy;
