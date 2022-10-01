import * as Phaser from 'phaser';
import {COLORS} from './constants';

class Spinner extends Phaser.GameObjects.Container {
	arc: Phaser.GameObjects.Graphics;

	constructor(scene: Phaser.Scene) {
		super(scene);
		this.x = 0;
		this.y = 0;

		const base = new Phaser.GameObjects.Graphics(scene);
		base.lineStyle(4, 0x80_00_27, 1);
		const a = new Phaser.Geom.Point(
			scene.game.config.width / 2,
			scene.game.config.height / 2,
		);
		const radius = 128;

		base.strokeCircle(a.x, a.y, radius);

		this.add(base);

		this.arc = new Phaser.GameObjects.Graphics(scene);

		this.arc.lineStyle(4, 0xff_00_4d, 1);

		//  Without this the arc will appear closed when stroked
		this.arc.beginPath();

		// arc (x, y, radius, startAngle, endAngle, anticlockwise)
		this.arc.arc(
			scene.game.config.width / 2,
			scene.game.config.height / 2,
			radius,
			Phaser.Math.DegToRad(90),
			Phaser.Math.DegToRad(180),
			true,
		);

		//  Uncomment this to close the path before stroking
		// graphics.closePath();

		this.arc.strokePath();

		this.add(this.arc);
	}
}

export default Spinner;
