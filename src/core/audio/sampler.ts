import Station from '@core/station';
import { Sample } from './sample';
import * as Audio from '@core/audio';

export class Sampler extends Station {
	#sample: Sample | null = null;
	#node: AudioBufferSourceNode;
	#export: Audio.Export;

	constructor() {
		super();
		this.#node = new AudioBufferSourceNode(Station.context);
		this.#export = new Audio.Export(this.#node);
		this.AddPort(this.#export);
	}

	SetSample(sample: Sample): void {
		this.#node = new AudioBufferSourceNode(Station.context);
		this.#sample = sample;
		this.#node.buffer = this.#sample.buffer;
		this.#export.Replace(this.#node);
	}

	get length(): number {
		if(this.#sample === null)
			return NaN;
		return this.#sample.buffer.length;
	}

	Start(t: number = 0): void {
		this.#node.start(t);
	}

	Stop(t: number = 0): void {
		this.#node.stop(t);
	}
}
