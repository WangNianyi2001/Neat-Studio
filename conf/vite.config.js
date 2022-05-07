import { defineConfig } from 'vite';
import conf from './conf.js';

export default defineConfig({
	root: conf.rootDir,
	build: {
		rollupOptions: {
			input: [conf.path('index.html')]
		}
	},
	optimizeDeps: {
		include: []
	}
});
