import * as Phaser from 'phaser';

import type IHero from '../entities/heroes/IHero';
import type IEntity from '../entities/IEntity';
import {COLORS} from './constants';

class PartyOverlay extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		combatants: IEntity[],
		onCloseRequest: () => void,
	) {
		super(scene);

		const heroes = combatants.filter((combatant) => combatant.isHero);

		this.renderRect();
		this.renderHeroes(heroes);
		this.renderClose(onCloseRequest);

		window.addEventListener('keyup', (event) => {
			this.handleKeyup(event, onCloseRequest);
		});
	}

	private renderRect() {
		this.x = 0;
		this.y = 0;
	}

	private renderHeroes(heroes: IHero[]) {
		for (const [i, hero] of heroes.entries()) {
			const nameText = new Phaser.GameObjects.Text(
				this.scene,
				10,
				10 + i * 20,
				hero.name,
				{
					fontSize: '24px',
					color: COLORS.WHITE,
					fontFamily: 'Kanit',
				},
			);

			this.add(nameText);
		}
	}

	private renderClose(onCloseRequest: () => void) {
		const closeBtnSize = 24;

		const closeBtn = new Phaser.GameObjects.Text(
			this.scene,
			this.scene.game.config.width - closeBtnSize - 10,
			10,
			'❌',
			{fontSize: `${closeBtnSize}px`},
		);
		closeBtn.setInteractive();
		closeBtn.on('pointerdown', () => {
			onCloseRequest();
		});

		this.add(closeBtn);
	}

	private handleKeyup(event: KeyboardEvent, onDestroyRequest: () => void) {
		if (event.key === 'Escape') {
			onDestroyRequest();

			window.removeEventListener('keydown', (event) => {
				this.handleKeyup(event, onDestroyRequest);
			});
		}
	}
}

export default PartyOverlay;
