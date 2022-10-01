import * as Phaser from 'phaser';
import {COLORS} from './constants';
import MenuBorder from './MenuBorder';

class HelpText extends Phaser.GameObjects.Container {
	private msg: Phaser.GameObjects.Text;
	private get interfaceHeight() {
		return 32;
	}

	private get interfaceWidth() {
		return 500;
	}

	private get borderThickness() {
		return 4;
	}

	constructor(scene: Phaser.Scene) {
		super(scene);

		this.msg = new Phaser.GameObjects.Text(scene, 48, 2, '?', {
			fontFamily: '"Kanit"',
			fontSize: '24px',
			color: COLORS.TURQUOISE,
		});

		this.x = 20;
		this.y = 20;

		this.add(this.msg);
		this.renderBorder();
	}

	updateText(value: string) {
		this.msg.text = `?  ${value}`;
		this.remove(this.msg);

		this.add(this.msg);
	}

	private renderBorder() {
		const border = new MenuBorder(this.scene, {
			width: this.interfaceWidth,
			height: this.interfaceHeight,
			borderThickness: this.borderThickness,
			renderTopRight: false,
			renderBottomLeft: false,
			// renderBottomRight: false,
		});
		this.add(border);
	}
}

export default HelpText;
