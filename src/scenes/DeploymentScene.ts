import * as Pixi from 'pixi.js';
import {COLORS} from '../ui/constants';

class Deployment extends Pixi.Container {
	app: Pixi.Application;

	constructor(app: Pixi.Application) {
		super();

		this.app = app;

		this.renderStart();
	}

	makeVisible() {
		this.visible = true;
	}

	private renderStart() {
		const redRect = new Pixi.Graphics();
		redRect.beginFill(0x22_22_22);

		redRect.drawRect(0, 0, this.app.view.width, this.app.view.height);

		this.addChild(redRect);

		const startText = new Pixi.Text('Start!');
		startText.anchor.set(0.5);
		startText.x = this.app.view.width / 3;
		startText.y = this.app.view.height / 3;
		startText.style = new Pixi.TextStyle({
			fill: COLORS.RED,
		});

		this.addChild(startText);
	}
}

export default Deployment;
