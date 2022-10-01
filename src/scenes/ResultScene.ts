import * as Pixi from 'pixi.js';
import type {BattleResult} from '../processors/battle/types';

class Result extends Pixi.Container {
	app: Pixi.Application;

	constructor(app: Pixi.Application) {
		super();

		window.addEventListener('keyup', this.switchContainer.bind(this));
	}

	appendText(result: BattleResult) {
		const redRect = new Pixi.Graphics();
		redRect.beginFill(0x22_22_22);

		redRect.drawRect(0, 0, this.app.view.width, this.app.view.height);

		this.addChild(redRect);

		const resultText = new Pixi.Text('Start!');
		resultText.anchor.set(0.5);
		resultText.x = this.app.view.width / 3;
		resultText.y = this.app.view.height / 3;
		resultText.style = new Pixi.TextStyle({
			fill: result.type === 'victory' ? 0x00_00_ff : COLORS.RED,
		});

		this.addChild(resultText);
	}

	makeVisible() {
		this.visible = true;
	}

	switchContainer(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				// Window.location.reload();
				break;
			default:
				break;
		}
	}
}

export default Result;
