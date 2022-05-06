const conf = require('./config');

export default {
	root: conf.distDir,
	build: {
		rollupOptions: {
			external: true
		}
	},
	optimizeDeps: {
		include: []
	}
}
