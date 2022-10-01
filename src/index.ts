import * as Phaser from 'phaser';

import LoadingScene from './scenes/LoadingScene';
import TitleScene from './scenes/TitleScene';
import BattleScene from './scenes/BattleScene';

const displayMode: 'big' | 'small' = 'small';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	parent: 'game',
	width: 1360,
	height: 768,
	antialias: false,
	// antialiasGL: false,
};

if (displayMode === 'big') {
	config.width = 2560;
	config.height = 1440;
}

const game = new Phaser.Game(config);

game.scene.add('loading', LoadingScene);
game.scene.add('title', TitleScene);
game.scene.add('battle', BattleScene);
game.scene.start('loading');
