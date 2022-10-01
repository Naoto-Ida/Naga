import * as Pixi from 'pixi.js';
import type {SceneEmitterEvents} from '../emitter/SceneEmitter';
import SceneEmitter from '../emitter/SceneEmitter';

class OverworldScene extends Pixi.Container {
	readonly sceneEmitter = new SceneEmitter<SceneEmitterEvents>();

	constructor(app: Pixi.Application, onStart: () => void) {
		super();

		const redRect = new Pixi.Graphics();
		redRect.beginFill(0x22_22_22);

		redRect.drawRect(0, 0, app.view.width, app.view.height);

		this.addChild(redRect);

		const startText = new Pixi.Text('Press [ENTER] to start battle');
		startText.anchor.set(0.5);
		startText.x = app.view.width / 2;
		startText.y = app.view.height / 2;
		startText.style = new Pixi.TextStyle({
			fill: 0xff_ff_ff,
			fontFamily: 'Kanit',
		});
		startText.interactive = true;
		startText.buttonMode = true;

		startText.on('pointerdown', () => {
			onStart();
		});

		this.addChild(startText);

		this.sceneEmitter.emit('start', this.name);

		window.addEventListener('keyup', this.switchContainer.bind(this));
	}

	makeVisible() {
		this.visible = true;
	}

	destroy(options?: boolean | Pixi.IDestroyOptions | undefined): void {
		console.warn('TITLE DESTROYED');
	}

	async switchContainer(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				if (this.visible) {
					console.warn('REQUEST BATTLE');
					this.sceneEmitter.emit('requestBattle', []);
				}

				break;

			default:
				break;
		}
	}
}

export default OverworldScene;
