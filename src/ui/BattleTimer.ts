import * as Phaser from 'phaser';

import GlobalEmitter from '../emitter/GlobalEmitter';
import {COLORS} from './constants';

class BattleTimer extends Phaser.GameObjects.Text {
	private timer?: NodeJS.Timer;
	private elapsedTime = 0;
	private readonly globalEmitter = new GlobalEmitter();

	constructor(scene: Phaser.Scene) {
		super(scene, scene.game.config.width / 2, 0, '00:00', {
			fontSize: '36px',
			fontFamily: '"Orbitron"',
			color: '#5EF6FF',
			fontStyle: 'bold',
		});

		this.setOrigin(0.5, 0);

		this.start();
	}

	start() {
		this.timer = setInterval(() => {
			this.elapsedTime += 1;
			const minutes = this.pad(Number.parseInt(this.elapsedTime / 60));
			const seconds = this.pad(this.elapsedTime % 60);

			this.text = `${minutes}:${seconds}`;
		}, 1000);
	}

	stop() {
		clearInterval(this.timer);
	}

	private pad(value: number) {
		const valueString = String(value);
		if (valueString.length < 2) {
			return '0' + valueString;
		}

		return valueString;
	}
}

export default BattleTimer;
