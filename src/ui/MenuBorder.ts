import * as Phaser from 'phaser';

class MenuBorder extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		{
			width,
			height,
			borderThickness,
			renderTopRight = true,
			renderBottomLeft = true,
			renderBottomRight = true,
		}: {
			width: number;
			height: number;
			borderThickness: number;
			renderTopRight?: boolean;
			renderBottomLeft?: boolean;
			renderBottomRight?: boolean;
		},
	) {
		super(scene);

		const foregroundFill = 0x5e_f6_ff;
		const border = new Phaser.GameObjects.Graphics(scene);

		border.lineStyle(borderThickness, foregroundFill);

		border.beginPath();

		// Top left
		border.moveTo(0, 0);
		// Bottom left
		border.lineTo(0, height);
		// Bottom right
		border.lineTo(width, height);
		// Top right
		border.lineTo(width, 0);
		border.closePath();
		border.strokePath();

		this.add(border);

		const bg = new Phaser.GameObjects.Graphics(scene);
		bg.fillStyle(0x18_3e_40);
		bg.fillRect(0, 0, width, height);
		this.add(bg);

		const [boxWidth, boxHeight, boxOffset] = [32, 10, 10];

		const topLeftBox = new Phaser.GameObjects.Graphics(scene);
		topLeftBox.lineStyle(borderThickness, foregroundFill);
		topLeftBox.fillStyle(foregroundFill);
		topLeftBox.beginPath();
		// Top left
		topLeftBox.moveTo(0, 0);
		// Bottom left
		topLeftBox.lineTo(0, boxHeight);
		// Bottom right
		topLeftBox.lineTo(boxWidth - boxOffset, boxHeight);
		// Top right
		topLeftBox.lineTo(boxWidth, 0);
		topLeftBox.closePath();
		topLeftBox.fillPath();
		this.add(topLeftBox);

		if (renderBottomLeft) {
			const bottomLeftBox = new Phaser.GameObjects.Graphics(scene);
			bottomLeftBox.lineStyle(borderThickness, foregroundFill);
			bottomLeftBox.fillStyle(foregroundFill);
			bottomLeftBox.beginPath();
			// Top left
			bottomLeftBox.moveTo(0, height - boxHeight);
			// Bottom left
			bottomLeftBox.lineTo(0, height);
			// Bottom right
			bottomLeftBox.lineTo(boxWidth, height);
			// Top right
			bottomLeftBox.lineTo(boxWidth - boxOffset, height - boxHeight);
			bottomLeftBox.closePath();
			bottomLeftBox.fillPath();
			this.add(bottomLeftBox);
		}

		if (renderTopRight) {
			const topRightBox = new Phaser.GameObjects.Graphics(scene);
			topRightBox.lineStyle(borderThickness, foregroundFill);
			topRightBox.fillStyle(foregroundFill);
			topRightBox.beginPath();
			// Top left
			topRightBox.moveTo(width - boxWidth, 0);
			// Bottom left
			topRightBox.lineTo(width - boxWidth + boxOffset, boxHeight);
			// Bottom right
			topRightBox.lineTo(width, boxHeight);
			// Top right
			topRightBox.lineTo(width, 0);
			topRightBox.closePath();
			topRightBox.fillPath();
			this.add(topRightBox);
		}

		if (renderBottomRight) {
			const bottomRightBox = new Phaser.GameObjects.Graphics(scene);
			bottomRightBox.lineStyle(borderThickness, foregroundFill);
			bottomRightBox.fillStyle(foregroundFill);
			bottomRightBox.beginPath();
			// Top left
			bottomRightBox.moveTo(width - boxWidth + boxOffset, height - boxHeight);
			// Bottom left
			bottomRightBox.lineTo(width - boxWidth, height);
			// Bottom right
			bottomRightBox.lineTo(width, height);
			// Top right
			bottomRightBox.lineTo(width, height - boxHeight);
			bottomRightBox.closePath();
			bottomRightBox.fillPath();
			this.add(bottomRightBox);
		}
	}
}

export default MenuBorder;
