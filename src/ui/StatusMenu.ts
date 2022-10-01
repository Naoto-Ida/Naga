import * as Phaser from 'phaser';

import type IEntity from '../entities/IEntity';
import {wait} from '../utils';
import {COLORS} from './constants';

class StatusMenu extends Phaser.GameObjects.Container {
	private get interfaceHeight() {
		return 20;
	}

	private heroText: Phaser.GameObjects.Text;
	private enemyText: Phaser.GameObjects.Text;
	private readonly baseStyle: Partial<Phaser.GameObjects.TextStyle> = {
		color: COLORS.WHITE,
		fontFamily: '"Kanit"',
		fontSize: '12px',
		fontStyle: 'bold',
	};

	constructor(scene: Phaser.Scene, combatants: IEntity[]) {
		super(scene, 0, 0);
		this.y = scene.game.config.height - this.interfaceHeight / 2;

		this.renderHeroes(combatants);
		this.renderEnemies(combatants);
		this.renderBox();

	}

	async addTextEffect(isTargetHero: boolean) {
		// if (isTargetHero) {
		// 	this.heroText.style = {
		// 		...this.baseStyle,
		// 		color: COLORS.RED,
		// 	};
		// } else {
		// 	this.enemyText.style = {
		// 		...this.baseStyle,
		// 		color: COLORS.RED,
		// 	};
		// }
		// await wait(1000);
		// this.heroText.style = this.baseStyle;
		// this.enemyText.style = this.baseStyle;
	}

	private renderBox() {
		const box = new Phaser.GameObjects.Rectangle(
			this.scene,
			0,
			0,
			this.scene.game.config.width * 2,
			this.interfaceHeight,
			0x22_22_22,
		);
		box.setDepth(0);
		this.add(box);
		this.sendToBack(box);
	}

	private renderHeroes(combatants: IEntity[]) {
		const heroesText = combatants
			.filter((entity) => entity.isHero)
			.sort((aEntity, bEntity) => {
				if (aEntity.name > bEntity.name) {
					return 1;
				}

				if (aEntity.name < bEntity.name) {
					return -1;
				}

				return 0;
			})
			.map(
				(entity) =>
					`${entity.name} HP: ${entity.currentHealth}/${entity.maxHealth}`,
			);

		this.heroText = new Phaser.GameObjects.Text(
			this.scene,
			0,
			-8,
			heroesText.join('  '),
			this.baseStyle,
		);

		this.add(this.heroText);
	}

	private renderEnemies(combatants: IEntity[]) {
		const enemiesText = combatants
			.filter((entity) => !entity.isHero)
			.sort((aEntity, bEntity) => {
				if (aEntity.name > bEntity.name) {
					return 1;
				}

				if (aEntity.name < bEntity.name) {
					return -1;
				}

				return 0;
			})
			.map(
				(entity) =>
					`${entity.name} HP: ${entity.currentHealth}/${entity.maxHealth}`,
			);

		this.enemyText = new Phaser.GameObjects.Text(
			this.scene,
			this.scene.game.config.width / 2,
			-8,
			enemiesText.join('  '),
			this.baseStyle,
		);

		this.add(this.enemyText);
	}
}

export default StatusMenu;
