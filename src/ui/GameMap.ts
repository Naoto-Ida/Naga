import * as Phaser from 'phaser';
import type IEntity from '../entities/IEntity';
import {COLORS} from './constants';

class GameMapTile extends Phaser.GameObjects.Text {
	private _isOccupied: boolean;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		currentIndex: number,
		style: any,
		onHover: (hoveredIndex: number) => void,
	) {
		const textWidth = 48;

		super(scene, textWidth * x, textWidth * y, '[x]', style);

		this.setInteractive();
		this.input.cursor = 'pointer';

		this.on('pointerdown', () => {
			console.log('?');
		});

		this.on('pointerover', () => {
			onHover(currentIndex);
		});

		this.on('pointerout', () => {
			if (this.isOccupied) {
				return;
			}

			this.setColor('white');
		});
	}

	get isOccupied() {
		return this._isOccupied;
	}

	set isOccupied(value: boolean) {
		this._isOccupied = value;
	}
}

class GameMap extends Phaser.GameObjects.Container {
	private get moveDistance() {
		return 3;
	}

	private readonly currentCombatant: IEntity;

	constructor(scene: Phaser.Scene, combatants: IEntity[]) {
		super(scene);

		this.currentCombatant = combatants.find((c) => c.name === 'Rabbit')!;

		const mapSize = 12;
		const style = {
			color: COLORS.WHITE,
			fontSize: '16px',
			fontStyle: 'bold',
		};

		for (let x = 0; x < mapSize; x++) {
			for (let y = 0; y < mapSize; y++) {
				const [currentX, currentY] = this.currentCombatant.currentPosition;
				const currentIndex = currentX * mapSize + currentY;
				const f = this.getAt(currentIndex) as Phaser.GameObjects.Text;

				const onHover = (hoveredIndex) => {
					// const indexRange: number[] = [];
					// for (let range = 1; range < this.moveDistance + 1; range++) {
					// 	indexRange.push( hoveredIndex - (range * mapSize));
					// 	// indexRange.push( hoveredIndex + (range * mapSize));
					// }
					// for (const range of indexRange) {
					// 	let g = this.getAt(range) as  Phaser.GameObjects.Text;
					// 	if (g) {
					// 		g.setColor('pink')
					// 	}
					// }
				};

				const v = new GameMapTile(scene, x, y, currentIndex, style, onHover);

				this.add(v);
			}
		}

		for (const combatant of combatants) {
			const [x, y] = combatant.currentPosition;
			const mapIndex = x * mapSize + y;

			const f = this.getAt(mapIndex) as GameMapTile;
			let tileColor: string;

			if (combatant.isHero) {
				tileColor = 'blue';

				if (combatant.battleEntityId === this.currentCombatant.battleEntityId) {
					tileColor = 'green';
					f.text = '[o]';
				}
			} else {
				tileColor = 'red';
			}

			f.setColor(tileColor);
			f.isOccupied = true;
		}

		// const f = this.getAt(16) as Phaser.GameObjects.Text;
		// console.warn({ f })
		// f.setColor('red');
		// f.update()

		this.x = scene.game.config.width / 2 - 220;
		this.y = 100;
	}
}

export default GameMap;
