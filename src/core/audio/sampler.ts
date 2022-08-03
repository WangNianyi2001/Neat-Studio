import Station from '@core/station';
import * as Audio from '@core/audio';

export class Sampler extends Station {
	#node: AudioBufferSourceNode;
	#export: Audio.Port;

	constructor() {
		super();
		this.#node = new AudioBufferSourceNode(Station.context);
		this.#export = new Audio.Port(this.#node, Station.PortType.Export);
		this.AddExport(this.#export);
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

Station.types.set('Sampler', Sampler);
