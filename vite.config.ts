import {defineConfig} from 'vitest/config';

export default defineConfig({
	base: './',
	build: {
		assetsInlineLimit: 0,
		// rollupOptions: {
		// 	external: 'phaser',
		// },
	},
});
