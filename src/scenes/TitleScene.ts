import * as Phaser from 'phaser';

import type {SceneEmitterEvents} from '../emitter/SceneEmitter';
import SceneEmitter from '../emitter/SceneEmitter';
import {COLORS} from '../ui/constants';
import WebFontFile from '../WebFontFile';

class TitleScene extends Phaser.Scene {
	private titleText: Phaser.GameObjects.Text;
	private logoImg = Phaser.GameObjects.Image;
	readonly sceneEmitter = new SceneEmitter<SceneEmitterEvents>();

	preload() {
		this.load.script(
			'webfont',
			'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
		);
		this.load.image('rabbit', 'avatars/rabbit.png');
		this.load.image('logo', 'zodiac.png');
	}

	create() {
		this.logoImg = this.add
			.image(this.game.config.width / 2, this.game.config.height / 2, 'logo')
			.setScale(0.1)
			.setTint(0x5E_F6_FF)
			.setAlpha(1);

		this.tweens.add({
			targets: this.logoImg,
			angle: 360,
			duration: 3000,
			repeat: -1,
		});

		this.titleText = this.add
			.text(
				`${this.game.config.width / 2}`,
				`${this.game.config.height / 2}`,
				'ZODIARK',
				{
					color: COLORS.TURQUOISE,
					fontFamily: '"Orbitron"',
					fontSize: '64px',
					fontStyle: 'bold',
				},
			)
			.setOrigin(0.5);

		this.add
			.text(`${this.game.config.width / 2}`, 450, 'PRESS ENTER TO START', {
				color: COLORS.TURQUOISE,
				fontFamily: 'Kanit',
				fontSize: '24px',
			})
			.setOrigin(this.titleText.originX);

		this.registerKeys();
	}

	private registerKeys() {
		const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
		enterKey.on('down', () => {
			this.scene.switch('battle');
		});
	}
}

export default TitleScene;
