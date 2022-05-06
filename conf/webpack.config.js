const conf = require('./config');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: {
		main: conf.dist('index.ts'),
	},
	output: {
		path: conf.dir,
		filename: 'index.js'
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

console.log(conf.path('conf/tsconfig.json'));
