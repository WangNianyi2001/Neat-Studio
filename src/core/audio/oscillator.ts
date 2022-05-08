import Station from '@core/station';
import * as Audio from '@core/audio';

export class Oscillator extends Station {
	readonly #node: OscillatorNode;
	readonly #export: Audio.Export;

	readonly length = Infinity;

	constructor() {
		super();
		this.#node = new OscillatorNode(Station.context);
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
