import * as Phaser from 'phaser';
import type IEntity from '../entities/IEntity';

class RosterMenu extends Phaser.GameObjects.Graphics {
	rosterHeight = 64;

	constructor(scene: Phaser.Scene, combatants: IEntity[]) {
		super(scene);

		// this.beginFill(0x22_22_22);
		// this.drawRect(0, app.view.height - this.rosterHeight, app.view.width, this.rosterHeight);
	}
}

export default RosterMenu;
