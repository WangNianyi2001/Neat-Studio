const path = require('path');

const rootDir = path.resolve(__dirname, '../');
const distRelDir = './dist/';
const distDir = path.resolve(rootDir, distRelDir);

const res = (...args) => path.resolve.bind(path, rootDir, ...args);

module.exports = {
	rootDir, distRelDir, distDir,
	path: res(),
	dist: res(distRelDir)
};
