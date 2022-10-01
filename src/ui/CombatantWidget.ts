import * as Phaser from 'phaser';

import type IEntity from '../entities/IEntity';
import {COLORS} from './constants';

class CombatantWidget extends Phaser.GameObjects.Container {
	private avatar: Phaser.GameObjects.Sprite;
	private get avatarPadding() {
		return 16;
	}

	private get avatarSize() {
		return 96;
	}

	private get interfaceHeight() {
		return 160;
	}

	private get interfaceWidth() {
		return 260;
	}

	private nameText: Phaser.GameObjects.Text;
	private healthText: Phaser.GameObjects.Text;

	private arrow: Phaser.GameObjects.Text;
	private readonly commonStyles: Partial<Phaser.GameObjects.TextStyle> = {
		fontFamily: '"Kanit"',
		color: COLORS.TURQUOISE,
		fontSize: '24px',
		fontStyle: 'bold',
	};

	constructor(scene: Phaser.Scene, combatant: IEntity, isAttacker = true) {
		super(scene, 0, 0, []);
		this.x = isAttacker ? this.interfaceWidth / 2 : this.interfaceWidth + 300;
		// @ts-expect-error
		this.y = scene.game.config.height - this.interfaceHeight / 2 - 80;

		this.addBorder();
		// this.renderBox();
		this.renderAvatar(combatant);
		this.renderName(combatant);
		this.renderHealth(combatant);
		this.renderStatuses(combatant);
		this.renderDeco();
		if (!isAttacker) {
			this.renderArrow();
		}
	}

	private addBorder() {
		const border = new Phaser.GameObjects.Graphics(this.scene);

		const color = 0x5e_f6_ff;
		const thickness = 4;
		const alpha = 1;

		border.lineStyle(thickness, color, alpha);

		border.beginPath();

		// Top left
		border.moveTo(-this.interfaceWidth / 2, -this.interfaceHeight / 2);
		// Bottom left
		border.lineTo(-this.interfaceWidth / 2, 48);
		// Bottom center left
		border.lineTo(0, 48);
		// Bottom center right
		border.lineTo(100, this.interfaceHeight / 2);
		// Bottom right
		border.lineTo(this.interfaceWidth, this.interfaceHeight / 2);
		// Top right
		border.lineTo(this.interfaceWidth, -this.interfaceHeight / 2);
		border.closePath();
		border.strokePath();

		this.add(border);
	}

	private renderName(combatant: IEntity) {
		this.nameText = new Phaser.GameObjects.Text(
			this.scene,
			-0,
			(this.interfaceHeight / 2) * -1 + this.avatarPadding,
			`LV. ${combatant.level} ${combatant.name}`,
			this.commonStyles,
		);
		this.add(this.nameText);
	}

	private renderHealth(combatant: IEntity) {
		this.healthText = new Phaser.GameObjects.Text(
			this.scene,
			this.nameText.x,
			this.nameText.y + 24,
			`HP: ${combatant.currentHealth}/${combatant.maxHealth}`,
			this.commonStyles,
		);

		this.add(this.healthText);
	}

	private renderAvatar(combatant: IEntity) {
		const avatarName = combatant.name === 'Rat' ? 'rat' : 'rabbit';

		this.avatar = new Phaser.GameObjects.Sprite(
			this.scene,
			-this.avatarSize + 30,
			-this.avatarPadding,
			avatarName,
		);
		this.avatar.setSize(this.avatarSize, this.avatarSize);
		this.avatar.setScale(0.2);
		this.add(this.avatar);
	}

	private renderStatuses(combatant: IEntity) {
		let statusTextContent = 'STATUS(ES):';

		if (Object.keys(combatant.statuses).length > 0) {
			if (combatant.isParalyzed) {
				statusTextContent += '  ⚡';
			}

			if (combatant.isOiled) {
				statusTextContent += '  🛢️';
			}

			if (combatant.isPoisoned) {
				statusTextContent += '  ☣️';
			}

			if (combatant.isNonTargetable) {
				statusTextContent += '  👻';
			}
		}

		const statusText = new Phaser.GameObjects.Text(
			this.scene,
			this.nameText.x,
			this.healthText.y + 24,
			statusTextContent,
			this.commonStyles,
		);
		this.add(statusText);
	}

	private renderArrow() {
		this.arrow = new Phaser.GameObjects.Text(this.scene, -164, -24, '>', {
			...this.commonStyles,
			fontSize: 48,
			color: COLORS.BLUE,
		});

		this.add(this.arrow);
	}

	private renderDeco() {
		const deco = new Phaser.GameObjects.Container(this.scene);
		deco.x = -124;
		deco.y = 58;

		const rectWidth = 30;

		for (let i = 0; i < 3; i++) {
			const sqr = new Phaser.GameObjects.Graphics(this.scene);
			sqr.fillStyle(0x5e_f6_ff);

			if (i === 0) {
				sqr.fillRect(0, 0, rectWidth, 20);
			} else {
				// sqr.fillRect(deco.last.body.position.x + rectWidth + 20, 0, rectWidth, 20);
			}

			deco.add(sqr);
		}

		this.add(deco);
	}
}

export default CombatantWidget;
