import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [tsconfigPaths()],
	server: {
		port: 3000
	},
	build: {
		rollupOptions: {
			input: './index.html'
		},
		outDir: './dist/'
	}
});
