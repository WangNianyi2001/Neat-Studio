import Station from '../station';
import * as Audio from '../audio';

export class Oscillator implements Station {
	node: OscillatorNode;

	readonly imports: Station.Import<any>[] = [];
	readonly exports: Station.Export<any>[];
	length = Infinity;

	constructor(context: AudioContext) {
		this.node = new OscillatorNode(context);
		this.exports = [new Audio.Export(this.node)];
	}
}
