import * as Phaser from 'phaser';

import Spinner from '../ui/Spinner';

class LoadingScene extends Phaser.Scene {
	private spinner: Phaser.GameObjects.Graphics;

	preload() {
		this.load.image('logo', 'zodiac.png');

		this.load.on('complete', () => {
			this.scene.switch('title');
		});
	}

	create() {
		this.spinner = new Spinner(this);
		this.add.existing(this.spinner);
	}
}

export default LoadingScene;
