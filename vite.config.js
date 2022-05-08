import { defineConfig } from 'vite';

export default defineConfig({
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
