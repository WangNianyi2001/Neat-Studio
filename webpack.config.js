module.exports = {
	mode: "development",
	devtool: "inline-source-map",
	entry: {
		main: "./index.ts",
	},
	output: {
		path: __dirname,
		filename: "index.js"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{ 
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	}
};
