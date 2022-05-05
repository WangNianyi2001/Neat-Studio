import * as Core from './core';

class Destination implements Core.Station {
	readonly #node: AudioDestinationNode;

	readonly imports: Core.Station.Import<any>[];
	readonly exports: Core.Station.Export<any>[] = [];
	readonly length = Infinity;

	constructor(node: AudioDestinationNode) {
		this.#node = node;
		this.imports = [
			new Core.Audio.Import(this.#node)
		];
	}
}

export default class Session {
	static current: Session;

	readonly context: AudioContext;
	readonly destination: Destination;

	constructor() {
		this.context = new AudioContext();
		this.destination = new Destination(this.context.destination);
	}
}
