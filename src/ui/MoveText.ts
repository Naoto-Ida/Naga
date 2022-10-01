import * as Phaser from 'phaser';

import type {ProcessedTurn} from '../processors/battle/types';
import {COLORS} from './constants';
import MenuBorder from './MenuBorder';

class MoveText extends Phaser.GameObjects.Container {
	private border: MenuBorder;
	private moveText: Phaser.GameObjects.Text;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly
	private interfaceWidth = 200;

	private get interfaceHeight() {
		return 50;
	}

	private get borderThickness() {
		return 4;
	}

	constructor(scene: Phaser.Scene, turn?: ProcessedTurn) {
		super(scene);

		this.interfaceWidth = turn?.move ? turn.move.name.length * 80 : 200;

		this.x = scene.game.config.width / 2 - this.interfaceWidth / 2;
		this.y = 80;

		this.addBorder();
		this.renderText(turn);
	}

	private addBorder() {
		if (this.border) {
			this.border.destroy();
		}

		this.border = new MenuBorder(this.scene, {
			width: this.interfaceWidth,
			height: this.interfaceHeight,
			borderThickness: this.borderThickness,
		});

		this.add(this.border);
	}

	private renderText(turn?: ProcessedTurn) {
		const moveTextContent = turn?.move
			? `${turn.belligerent.combatant.name} used ${turn.move.name}!`
			: 'Skipped turn!';
		this.moveText = new Phaser.GameObjects.Text(
			this.scene,
			this.interfaceWidth / 2,
			this.interfaceHeight / 2,
			moveTextContent,
			{
				color: COLORS.TURQUOISE,
				fontFamily: '"Kanit"',
				align: 'center',
				fontSize: '24px',
				fontStyle: 'bold',
			},
		).setOrigin(0.5, 0.5);
		this.addBorder();

		this.border.add(this.moveText);

		this.update();
	}
}

export default MoveText;
