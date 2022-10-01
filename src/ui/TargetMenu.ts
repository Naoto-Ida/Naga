import * as Phaser from 'phaser';

import type IEntity from '../entities/IEntity';
import {COLORS} from './constants';
import MenuBorder from './MenuBorder';

class TargetMenuItem extends Phaser.GameObjects.Text {
	private readonly ogMoveStyle: Partial<Phaser.GameObjects.TextStyle> = {
		fontFamily: '"Kanit"',
		fontSize: '24px',
		color: '#5EF6FF',
	};

	constructor(
		scene: Phaser.Scene,
		index: number,
		padding: number,
		target: IEntity,
		onSelect: () => void,
		onMouseOver: () => void,
		onMouseOut: () => void,
	) {
		super(scene, padding, padding + 24 * index, target.name, {});
		this.setStyle(this.ogMoveStyle);

		this.setOrigin(0, 0);

		this.setInteractive();
		this.input.cursor = 'pointer';

		this.on('pointerdown', () => {
			onSelect();
		});

		this.on(Phaser.Input.Events.POINTER_OVER, onMouseOver);

		this.on('mouseout', onMouseOut);
	}
}

class TargetMenu extends Phaser.GameObjects.Container {
	private readonly ogMoveStyle: Partial<Phaser.GameObjects.TextStyle> = {
		fontFamily: '"Kanit"',
		fontSize: '16px',
		color: COLORS.BLUE,
	};

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

	constructor(
		scene: Phaser.Scene,
		targets: IEntity[],
		onItemClick: (target: IEntity) => void,
		onMouseOver: (target: IEntity) => void,
		onMouseOut: () => void,
	) {
		super(scene);

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

		for (const [i, target] of targets.entries()) {
			const targetText = new TargetMenuItem(
				scene,
				i,
				this.interfacePadding,
				target,
				() => {
					onItemClick(target);
				},
				() => {
					console.log(`mouseover ${target.name}`);
					onMouseOver(target);
				},
				() => {
					onMouseOut();
				},
			);

			commands.push(targetText);
		}

		for (const command of commands) {
			this.add(command);
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

export default TargetMenu;
