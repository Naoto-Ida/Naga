import * as Phaser from 'phaser';

import type IArea from '../areas/IArea';
import Slum from '../areas/Slum';
import type IHero from '../entities/heroes/IHero';
import Ox from '../entities/heroes/Ox';
import Rat from '../entities/heroes/Rat';
import type {BattleProcessorConf} from '../processors/battle/BattleProcessor';
import BattleProcessor from '../processors/battle/BattleProcessor';
import type IEntity from '../entities/IEntity';
import {wait} from '../utils';
import Rabbit from '../entities/heroes/Rabbit';
import type IOffensiveMove from '../moves/offensive/IOffensiveMove';
import type IDefensiveMove from '../moves/defensive/IDefensiveMove';
import BattleMenu from '../ui/BattleMenu';
import PhaseWidget from '../ui/PhaseWidget';
import CombatantWidget from '../ui/CombatantWidget';
import TargetMenu from '../ui/TargetMenu';
import {
	getAllPossibleTargetsBasedOnMove,
	getPossibleTargetsBasedOnMove,
	getSingleTargetBasedOnMove,
} from '../processors/battle/getTargets';
import StatusMenu from '../ui/StatusMenu';
import type {ProcessedTurn} from '../processors/battle/types';
import BattleTimer from '../ui/BattleTimer';
import type RosterMenu from '../ui/RosterMenu';
import HelpText from '../ui/HelpText';
import PartyOverlay from '../ui/PartyOverlay';
import {COLORS} from '../ui/constants';
import MoveText from '../ui/MoveText';
import GameMap from '../ui/GameMap';
import type IMove from '../moves/IMove';

class BattleScene extends Phaser.Scene {
	private bp: BattleProcessor;
	private _area: IArea;
	private _heroes: IHero[];
	private _statusMenu: StatusMenu;
	private _targetMenu: TargetMenu;
	private _startText: Phaser.GameObjects.Text;
	private readonly _deathText: Phaser.GameObjects.Text;
	private readonly _deaths: IEntity[] = [];
	private readonly _debugText?: Phaser.GameObjects.Text;
	private readonly _renderNext?: Phaser.GameObjects.Text;
	private _phaseCountText?: PhaseWidget;
	private _combatantWidget?: CombatantWidget;
	private _targetWidget?: CombatantWidget;
	private _bpGen: Generator<void, void>;
	private battleTimer: BattleTimer;
	private readonly rosterMenu: RosterMenu;
	private readonly helpText: HelpText;
	private partyOverlayToggle: Phaser.GameObjects.Text;
	private partyOverlay: PartyOverlay;
	private get _isLastTurn() {
		return false;
	}

	private _battleMenu?: BattleMenu;

	preload() {
		this.load.image(
			Rat.name.toLowerCase(),
			`avatars/${Rat.name.toLocaleLowerCase()}.png`,
		);
		this.load.image('rabbit', 'avatars/rabbit.png');
		// this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
		// this.load.addFile(new WebFontFile(this.load, 'Kanit'));
	}

	async init({
		battleConfig,
		combatants,
	}: {
		battleConfig: BattleProcessorConf;
		combatants?: IEntity[];
	}) {
		this.bp = new BattleProcessor();

		this.pickArea();

		if (combatants) {
			this._heroes = combatants;
		} else {
			this.setupHeroes();
		}

		this.bp.event.subscribe('start', () => {
			this.battleTimer = new BattleTimer(this);

			this.add.existing(this.battleTimer);

			window.combatants = this.bp.combatants;
			this._bpGen = this.bp.handleTurn();

			this._startText = new Phaser.GameObjects.Text(
				this,
				this.game.config.width / 2,
				this.game.config.height / 2,
				'Battle started',
				{
					fontSize: '24px',
					fontFamily: '"Kanit"',
				},
			);
			this._startText.setOrigin(0.5, 0.5);
			this.add.existing(this._startText);

			this.renderBattleStats(this.bp.combatants);

			// const m = new GameMap(this, this.bp.combatants);
			// this.add.existing(m);

			this._bpGen.next();

			setTimeout(() => {
				this._startText.destroy();
			}, 1000);
		});

		this.bp.event.subscribe('phaseStart', (phaseNumber) => {
			console.log('🎬  Phase start');
			this.updatePhaseText();
		});

		this.bp.event.subscribe('turnStart', async ({combatant}) => {
			if (combatant.isDead) {
				this.bp.event.emit('turnDecided', {
					combatant,
					move: undefined,
					targets: [],
				});
				return;
			}

			combatant.incrementStatus();

			console.log('');
			console.log(`⚡  ${combatant.name}'s turn!`);

			if (combatant.isHero) {
				let move: IOffensiveMove | IDefensiveMove | undefined;
				const targets: IEntity[] = [];

				if (combatant.canTakeTurn()) {
					this.renderBattleMenu(combatant);
				} else {
					console.log(`Skipped turn for ${combatant.name}`);
					this.bp.event.emit('turnDecided', {combatant, move, targets});
				}
			} else {
				this._combatantWidget = new CombatantWidget(this, combatant);
				this.renderBattleMenu(combatant);

				let move: IOffensiveMove | IDefensiveMove | undefined;
				let targets: IEntity[] = [];

				if (combatant.canTakeTurn()) {
					move = this.bp.pickRandomMove(combatant);
					targets = getPossibleTargetsBasedOnMove(
						combatant,
						this.bp.combatants,
						move,
					);
				}

				await wait(2000);
				this.bp.event.emit('turnDecided', {combatant, move, targets});
			}
		});

		this.bp.event.subscribe('death', (combatant: IEntity) => {
			this._deaths.push(combatant);
		});

		this.bp.event.subscribe('turnEnd', async ({processedTurn}) => {
			this.renderBattleStats(this.bp.combatants);
			if (this._battleMenu) {
				this._battleMenu.destroy();
			}

			if (this._combatantWidget) {
				this._combatantWidget.destroy();
			}

			if (this._targetWidget) {
				this._targetWidget.destroy();
			}

			if (this._isLastTurn) {
				return;
			}

			await this.animateMove(processedTurn);

			await wait(0);

			if (this.bp.shouldResolveBattle()) {
				this.bp.event.emit('end', {
					resultType: this.bp.getBattleResultType(),
					combatants: this.bp.combatants,
				});
			} else {
				this._bpGen.next();
			}
		});

		this.bp.event.subscribe('phaseEnd', () => {
			console.log('🛑  Phase end');
			this.bp.removeDead();
			this._bpGen = this.bp.handleTurn();
			this.bp.phase = 2;

			this.updatePhaseText();

			this._bpGen.next();
		});

		this.bp.event.subscribe('end', ({resultType, combatants}) => {
			this.battleTimer.stop();

			// const endText = new Pixi.Text(resultType.toUpperCase());

			// endText.anchor.set(0.5);
			// endText.x = this.app.view.width / 2;
			// endText.y = this.app.view.height / 2;
			// endText.style = new Pixi.TextStyle({
			// 	fontFamily: 'Kanit',
			// 	fill: resultType === 'victory' ? 0x00_FF_00 : 0xFF_00_00,
			// });

			// this.add.existing(endText);
			// this.removeChild(this._statusMenu);
			// this.removeChild(this._startText);
			// this.removeChild(this._deathText);
			// if (this._battleMenu) {
			// 	this._battleMenu.removeC();
			// 	this.removeChild(this._battleMenu);
			// 	this._battleMenu.destroy();
			// 	this._battleMenu = undefined;
			// }

			// if (this._phaseCountText) {
			// 	this.removeChild(this._phaseCountText);
			// }

			// console.warn({combatants});
		});

		// this.renderMap();
		this.helpText = new HelpText(this);
		this.helpText.visible = false;
		this.add.existing(this.helpText);

		// this.renderPartyOverlayToggle();

		// this.viewport = new Viewport({
		// 	worldWidth: 1920,
		// 	worldHeight: 1080,
		// });

		// this.viewport.drag({});
		// const fakeTurn: ProcessedTurn = {
		// 	move: undefined,
		// 	belligerent: {
		// 		combatant: new Rat(),
		// 		targets: []
		// 	}
		// };
		// const moveText = new MoveText(this, fakeTurn);
		// this.add.existing(moveText);

		this.registerKeys();

		return this.bp.init(
			[...this._heroes, ...this._area.enemySet],
			battleConfig,
		);
	}

	renderMap() {
		const tileWidth = 100;
		const tileHeight = 75;
		const hillTileWidth = 100;
		const hillTileHeight = 80;

		const sprite = new Pixi.Sprite(
			Pixi.Texture.from('roadTiles_nova/beach.png'),
		);
		sprite.anchor.set(0.5);
		sprite.x = this.app.view.width / 2;
		sprite.y = this.app.view.height / 2;
		sprite.interactive = true;
		sprite.on('mouseover', () => {
			sprite.tint = 0x88_88_88;
		});

		sprite.on('mouseout', () => {
			sprite.tint = 0xff_ff_ff;
		});

		this.addChild(sprite);

		const sprite2 = new Pixi.Sprite(
			Pixi.Texture.from('roadTiles_nova/beach.png'),
		);
		sprite2.anchor.set(0.5);
		sprite2.x = this.app.view.width / 2 + tileWidth;
		sprite2.y = this.app.view.height / 2;

		sprite2.on('mouseover', () => {
			sprite2.tint = 0x88_88_88;
		});

		sprite2.on('mouseout', () => {
			sprite2.tint = 0xff_ff_ff;
		});

		this.addChild(sprite2);

		const sprite3 = new Pixi.Sprite(
			Pixi.Texture.from('roadTiles_nova/hillS.png'),
		);
		sprite3.anchor.set(0.5);
		sprite3.x = this.app.view.width / 2 + tileWidth / 2;
		sprite3.y = this.app.view.height / 2 + 18;

		sprite3.on('mouseover', () => {
			sprite3.tint = 0x88_88_88;
		});

		sprite3.on('mouseout', () => {
			sprite3.tint = 0xff_ff_ff;
		});

		this.addChild(sprite3);
	}

	toggleDebug() {}

	private pickArea() {
		const areas = {
			Slum: new Slum(),
			// Factory: new Factory(),
		} as const;

		const areaKeys = Object.keys(areas);
		const randomKey = areaKeys[Math.floor(Math.random() * areaKeys.length)];

		this._area = areas[randomKey];
	}

	private setupHeroes() {
		this._heroes = [new Rat(), new Ox(), new Rabbit()];
	}

	private renderTargetMenu(
		combatant: IEntity,
		move: IOffensiveMove | IDefensiveMove,
		targets: IEntity[],
	) {
		if (this._targetMenu) {
			this._targetMenu.destroy();
		}

		this._targetMenu = new TargetMenu(
			this,
			targets,
			async (target: IEntity) => {
				this._targetMenu.destroy();

				if (this._battleMenu) {
					this._battleMenu.destroy();
				}

				if (this._combatantWidget) {
					this._combatantWidget.destroy();
				}

				await wait(0);

				this.bp.event.emit('turnDecided', {
					combatant,
					move,
					targets: [target],
				});
			},
			(hoveredTarget: IEntity) => {
				console.log('hover');
				if (this._targetWidget) {
					this._targetWidget.destroy();
				}

				this._targetWidget = new CombatantWidget(this, hoveredTarget, false);
				this.add.existing(this._targetWidget);
			},
			() => {
				if (this._targetWidget) {
					this._targetWidget.destroy();
				}
			},
		);

		this.add.existing(this._targetMenu);
	}

	private renderBattleStats(combatants: IEntity[]) {
		if (this._statusMenu) {
			this._statusMenu.destroy();
		}

		this._statusMenu = new StatusMenu(this, combatants);

		this.add.existing(this._statusMenu);
	}

	private renderBattleMenu(combatant: IEntity) {
		console.log('🎨  RENDER BATTLE MENU');
		// if (this._renderNext) {
		// 	this.removeChild(this._renderNext);
		// 	this._renderNext = undefined;
		// }

		// if (this._combatantWidget) {
		// 	this.removeChild(this._combatantWidget);
		// 	this._combatantWidget = undefined;
		// }

		// if (this._battleMenu) {
		// 	this._battleMenu.destroy();
		// }

		this._battleMenu = new BattleMenu(
			this,
			combatant,
			(_, move) => {
				this._battleMenu?.setVisible(false);

				const targets = getAllPossibleTargetsBasedOnMove(
					combatant,
					this.bp.combatants,
					move,
				);

				this.renderTargetMenu(combatant, move, targets);

				// return;

				// this.bp.event.emit('turnDecided', {combatant, move});
			},
			(move: IMove) => {
				this.helpText.updateText(move.description);
				this.helpText.visible = true;
			},
			() => {
				this.helpText.updateText('');
				this.helpText.visible = false;
			},
		);

		this._combatantWidget = new CombatantWidget(this, combatant);

		setTimeout(() => {
			this.add.existing(this._battleMenu!);
			this.add.existing(this._combatantWidget!);
		}, 0);
	}

	private updatePhaseText() {
		console.log('🎨  Update phase text');
		if (this._phaseCountText) {
			this._phaseCountText.destroy();
		}

		this._phaseCountText = new PhaseWidget(this);
		this._phaseCountText.typewriter(`PHASE ${this.bp.phase}`);
		this.add.existing(this._phaseCountText);
	}

	private async animateMove(turn?: ProcessedTurn) {
		return new Promise(async (resolve) => {
			const moveText = new MoveText(this, turn);
			this.add.existing(moveText);

			await wait(2000);

			moveText.destroy();

			if (turn?.move) {
				for (const target of turn.belligerent.targets) {
					let effectTextContent = 'Test';

					switch (turn.move.type) {
						case 'offensive':
							effectTextContent = `${turn.belligerent.combatant.name} damaged ${target.name} with ${turn.move.name}!`;
							break;
						case 'defensive':
							effectTextContent = `${turn.belligerent.combatant.name} used ${turn.move.name} on ${target.name}!`;
							break;
						default:
							break;
					}

					const effectText = new Phaser.GameObjects.Text(
						this,
						this.game.config.width / 2,
						this.game.config.height / 2,
						effectTextContent,
						{
							color: COLORS.WHITE,
						},
					);

					this.add.existing(effectText);

					await this._statusMenu.addTextEffect(target.isHero);

					effectText.destroy();
				}
			}

			console.log('ANIMATING');
			await wait(0);
			console.log('DONE');
			resolve(1);
		});
	}

	private renderPartyOverlayToggle() {
		this.partyOverlayToggle = new Pixi.Text('📚');
		this.partyOverlayToggle.x = 10;
		this.partyOverlayToggle.y = 10;
		this.partyOverlayToggle.interactive = true;
		this.partyOverlayToggle.buttonMode = true;
		this.partyOverlayToggle.on('pointerdown', () => {
			if (this.battleTimer) {
				this.battleTimer.stop();
			}

			this.renderPartyOverlay();
		});

		this.add.existing(this.partyOverlayToggle);
	}

	private renderPartyOverlay() {
		this.partyOverlay = new PartyOverlay(this, this.bp.combatants, () => {
			if (this.partyOverlay) {
				this.partyOverlay.destroy();
			}

			if (this.battleTimer) {
				this.battleTimer.start();
			}
		});

		this.add.existing(this.partyOverlay);
	}

	private registerKeys() {
		const toggleTimerKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

		toggleTimerKey.on('down', () => {
			this.battleTimer.visible = !this.battleTimer.visible;
		});
	}
}

export default BattleScene;
