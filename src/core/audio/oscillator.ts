import Station from '../station';
import * as Audio from '../audio';

export class Oscillator extends Station {
	readonly #node: OscillatorNode;
	readonly #export: Audio.Export;

	readonly length = Infinity;

	constructor(context: AudioContext) {
		super();
		this.#node = new OscillatorNode(context);
		this.#export = new Audio.Export(this.#node);
		this.AddPort(this.#export);
	}

	Start(t: number = 0): void {
		this.#node.start(t);
	}

	Stop(t: number = 0): void {
		this.#node.stop(t);
	}
}
