import * as Phaser from 'phaser';

import type IEntity from '../entities/IEntity';
import type IDefensiveMove from '../moves/defensive/IDefensiveMove';
import type IMove from '../moves/IMove';
import type IOffensiveMove from '../moves/offensive/IOffensiveMove';
import {COLORS} from './constants';
import MenuBorder from './MenuBorder';

class BattleMenuItem extends Phaser.GameObjects.Text {
	private readonly ogMoveStyle: Partial<Phaser.GameObjects.TextStyle> = {
		fontFamily: '"Kanit"',
		fontSize: '24px',
		color: '#5EF6FF',
	};

	private isMousedOver = false;

	constructor(
		scene: Phaser.Scene,
		index: number,
		padding: number,
		move: IOffensiveMove | IDefensiveMove,
		onSelect: () => void,
		onMouseOver: (item: IMove) => void,
		onMouseOut: () => void,
	) {
		super(scene, padding, padding + 24 * index, move.name, {});
		this.setStyle(this.ogMoveStyle);

		this.setOrigin(0, 0);

		this.setInteractive();
		this.input.cursor = 'pointer';

		this.on('pointerdown', () => {
			onSelect();
		});

		this.on('pointerover', () => {
			if (this.isMousedOver) {
				return;
			}

			this.isMousedOver = true;

			onMouseOver(move);
		});

		this.on('pointerout', () => {
			onMouseOut();
			this.isMousedOver = false;
			// this.style = ogMoveStyle;
		});
	}
}

class BattleMenu extends Phaser.GameObjects.Container {
	private get interfaceWidth() {
		return 200;
	}

	private get interfaceHeight() {
		return 200;
	}

	private get interfacePadding() {
		return 10;
	}

	private get borderThickness() {
		return 4;
	}

	private readonly combatant: IEntity;
	constructor(
		scene: Phaser.Scene,
		combatant: IEntity,
		onItemClick: (
			combatant: IEntity,
			move: IOffensiveMove | IDefensiveMove,
		) => void,
		onItemHover: (item: IMove) => void,
		onItemHoverOff: () => void,
	) {
		super(scene);

		this.combatant = combatant;

		this.x =
			scene.game.config.width - this.interfaceWidth - this.borderThickness - 10;
		this.y =
			scene.game.config.height -
			this.interfaceHeight -
			20 -
			this.borderThickness -
			10;

		this.renderBorder();

		const commands: Phaser.GameObjects.Text[] = [];

		// const moveOption = new Phaser.GameObjects.Text(scene, this.interfacePadding, this.interfacePadding, 'Move');
		// moveOption.setOrigin(0);
		// moveOption.setInteractive();

		// moveOption.input.cursor = 'pointer';

		// this.add(moveOption);

		for (const [i, move] of combatant.availableMoves.entries()) {
			const moveText = new BattleMenuItem(
				scene,
				i,
				this.interfacePadding,
				move,
				() => {
					onItemClick(combatant, move);
				},
				(item) => {
					onItemHover(item);
				},
				() => {
					onItemHoverOff();
				},
			);

			moveText.setOrigin(0, 0);

			commands.push(moveText);
		}

		if (combatant.isHero) {
			for (const command of commands) {
				this.add(command);
			}
		}
	}

	private renderBorder() {
		const graphics = new MenuBorder(this.scene, {
			width: this.interfaceWidth,
			height: this.interfaceHeight,
			borderThickness: this.borderThickness,
		});

		this.add(graphics);
	}
}

export default BattleMenu;
