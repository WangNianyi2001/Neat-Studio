import Station from '@core/station';
import { Sample } from './sample';
import * as Audio from '@core/audio';

export class Sampler extends Station {
	#node: AudioBufferSourceNode;
	#export: Audio.Export;

	constructor() {
		super();
		this.#node = new AudioBufferSourceNode(Station.context);
		this.#export = new Audio.Export(this.#node);
		this.AddPort(this.#export);
	}

	SetSample(buffer: AudioBuffer): void {
		this.#node = new AudioBufferSourceNode(Station.context);
		this.#node.buffer = buffer;
		this.#export.Replace(this.#node);
	}

	get length(): number {
		if(this.#node.buffer === null)
			return NaN;
		return this.#node.buffer.length;
	}

	Start(t: number = 0): void {
		this.#node.start(t);
	}

	Stop(t: number = 0): void {
		this.#node.stop(t);
	}
}
