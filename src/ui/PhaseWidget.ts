import * as Phaser from 'phaser';

import {COLORS} from './constants';

class PhaseWidget extends Phaser.GameObjects.Text {
	private get index() {
		return 0;
	}

	private get internalText() {
		return '';
	}

	private readonly _typewriter: NodeJS.Timer;

	constructor(scene: Phaser.Scene) {
		super(scene, scene.game.config.width, 0, '', {
			align: 'right',
			color: COLORS.BLUE,
			fontFamily: '"Kanit"',
			fontStyle: 'bold',
		});
	}

	typewriter(text: string) {
		// this._typewriter = setInterval(() => {
		// 	this.internalText += text[this.index];
		// 	this.text = this.internalText;

		// 	if (this.index + 1 >= text.length) {
		// 		clearInterval(this._typewriter);
		// 	}

		// 	this.index += 1;
		// }, 50);
		this.text = text;
	}
}

export default PhaseWidget;
