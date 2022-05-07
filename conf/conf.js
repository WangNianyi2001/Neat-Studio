import * as path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const rootDir = path.resolve(dirName, '../');
const distRelDir = './dist/';
const distDir = path.resolve(rootDir, distRelDir);

const res = (...args) => path.resolve.bind(path, rootDir, ...args);

export default {
	rootDir, distRelDir, distDir,
	path: res(),
	dist: res(distRelDir)
};
