import conf from './conf.js';

export default {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: {
		main: conf.path('index.ts'),
	},
	output: {
		path: conf.rootDir,
		filename: 'dist/index.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{ 
				test: /\.tsx?$/,
				use: [{
					loader: 'ts-loader',
					options: {
						configFile: conf.path('conf/tsconfig.json')
					}
				}],
				exclude: conf.path('conf')
			}
		]
	}
};
