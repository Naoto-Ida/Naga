import * as Pixi from 'pixi.js';
import type {SceneEmitterEvents} from '../emitter/SceneEmitter';
import SceneEmitter from '../emitter/SceneEmitter';
import Dragon from '../entities/heroes/Dragon';
import Horse from '../entities/heroes/Horse';
import Monkey from '../entities/heroes/Monkey';
import Ox from '../entities/heroes/Ox';
import Rabbit from '../entities/heroes/Rabbit';
import Ram from '../entities/heroes/Ram';
import Rat from '../entities/heroes/Rat';
import Snake from '../entities/heroes/Snake';
import Tiger from '../entities/heroes/Tiger';
import type IEntity from '../entities/IEntity';
import {COLORS} from '../ui/constants';

class CombatSimulator extends Pixi.Container {
	readonly sceneEmitter = new SceneEmitter<SceneEmitterEvents>();
	app: Pixi.Application;
	private readonly combatants: IEntity[] = [];
	hasStartText = false;

	constructor(app: Pixi.Application) {
		super();

		this.app = app;

		const redRect = new Pixi.Graphics();
		redRect.beginFill(0x22_22_22);

		redRect.drawRect(
			this.app.view.width / 2,
			this.app.view.height / 4,
			this.app.view.width / 4,
			this.app.view.height / 2,
		);

		const heroes = [
			new Rat(),
			new Ox(),
			new Tiger(),
			new Rabbit(),
			new Dragon(),
			new Snake(),
			new Horse(),
			new Ram(),
			new Monkey(),
		];

		for (const [index, hero] of heroes.entries()) {
			const heroText = new Pixi.Text(hero.name);
			heroText.x = 500;
			heroText.y = 30 * index;
			heroText.buttonMode = true;
			heroText.interactive = true;
			heroText.style = new Pixi.TextStyle({
				fill: 0xff_ff_ff,
			});
			heroText.on('pointerdown', () => {
				console.warn(hero.name);
				if (this.combatants.length === 3) {
					return;
				}

				this.combatants.push(hero);

				if (this.combatants.length === 3 && !this.hasStartText) {
					const startText = new Pixi.Text('Start');
					startText.style = new Pixi.TextStyle({
						fill: COLORS.RED,
					});
					startText.buttonMode = true;
					startText.interactive = true;

					startText.on('pointerdown', () => {
						this.sceneEmitter.emit('requestBattle', this.combatants);
					});

					this.addChild(startText);
					this.hasStartText = true;
				}

				// HeroText.style.fill = 0xff0000;
				console.log(`Added ${hero.name}`);
			});

			redRect.addChild(heroText);
		}

		this.addChild(redRect);

		window.addEventListener('keyup', this.switchContainer.bind(this));
	}

	makeVisible() {
		this.visible = true;
	}

	async switchContainer(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				if (this.visible) {
					this.sceneEmitter.emit('requestBattle');
				}

				break;

			default:
				break;
		}
	}
}

export default CombatSimulator;
