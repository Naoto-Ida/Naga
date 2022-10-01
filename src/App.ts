import * as Pixi from 'pixi.js';
// Import { Assets } from '@pixi/assets';

import TitleScene from './scenes/TitleScene';
import OverworldScene from './scenes/OverworldScene';
import BattleScene from './scenes/BattleScene';
import CombatSimulator from './scenes/CombatSimulatorScene';
import ResultScene from './scenes/ResultScene';
import type IEntity from './entities/IEntity';

Pixi.Loader.shared.add({
	name: 'Kanit',
	url: 'https://fonts.googleapis.com/css?family=Kanit:wght@300;400;700&display=swap',
});
Pixi.Loader.shared.add({
	name: 'Orbitron',
	url: 'https://fonts.googleapis.com/css?family=Orbitron:wght@300;400;700&display=swap',
});

Pixi.Loader.shared.load();

let title: TitleScene;
let overworld: OverworldScene;
let simulator: CombatSimulator;
let battle: BattleScene;
let resultScene: ResultScene;

export default class App {
	private readonly aspectRatio = 9 / 16;
	static _instance?: App;
	private readonly app: Pixi.Application;

	constructor() {
		if (App._instance) {
			throw new Error(
				"Singleton classes can't be instantiated more than once.",
			);
		}

		App._instance = this;
		this.app = new Pixi.Application({
			width: document.body.clientWidth,
			height: document.body.clientWidth * this.aspectRatio,
			antialias: true,
			resolution: 1,
		});

		// Window.addEventListener('resize', () => {
		// 	this.app.renderer.resize(window.innerWidth, document.body.clientWidth * this.aspectRatio);
		// });

		document.body.append(this.app.view);

		this.setupTitle();
		this.app.stage.addChild(title);

		this.setupOverworld();
		this.app.stage.addChild(overworld);

		battle = new BattleScene(this.app);
		this.app.stage.addChild(battle);

		this.setupSimulator();
		this.app.stage.addChild(simulator);

		resultScene = new ResultScene(this.app);
		this.app.stage.addChild(resultScene);

		Pixi.Loader.shared.onComplete.once(() => {
			title.visible = true;
		});
	}

	async onStartBattle(combatants?: IEntity[]) {
		title.visible = false;
		overworld.visible = false;
		simulator.visible = false;
		battle.visible = true;
		const result = await battle.init({
			battleConfig: {isDebug: true},
			combatants,
		});
		battle.visible = true;
		resultScene.visible = true;
	}

	async onStartSimulator() {
		title.visible = false;
		overworld.visible = false;
		simulator.visible = true;
	}

	private setupTitle() {
		title = new TitleScene(this.app, () => {
			title.visible = false;
			overworld.visible = true;
		});
		title.visible = false;
		title.sceneEmitter.subscribe('start', () => {
			console.log('START');
		});

		// Title.sceneEmitter.subscribe('requestBattle', async v => {
		// 	title.visible = false;
		// 	overworld.visible = true;
		// 	// await this.onStartBattle();
		// });

		title.sceneEmitter.subscribe('requestOverworld', (v) => {
			title.visible = false;
			overworld.visible = true;
		});

		title.sceneEmitter.subscribe('requestSimulator', (v) => {
			console.warn('START SIM');
			this.onStartSimulator();
		});
	}

	private setupOverworld() {
		overworld = new OverworldScene(this.app, this.onStartBattle);
		overworld.visible = false;

		overworld.sceneEmitter.subscribe('requestBattle', async (v) => {
			await this.onStartBattle();
		});
	}

	private setupSimulator() {
		simulator = new CombatSimulator(this.app);
		simulator.visible = false;
		simulator.sceneEmitter.subscribe('requestBattle', async (v) => {
			await this.onStartBattle(v);
		});
	}
}
