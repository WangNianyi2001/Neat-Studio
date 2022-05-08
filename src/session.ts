import * as Core from './core';

class Destination extends Core.Station {
	readonly #node: AudioDestinationNode;
	readonly #import: Core.Audio.Import;

	readonly length = Infinity;

	constructor(node: AudioDestinationNode) {
		super();
		this.#node = node;
		this.#import = new Core.Audio.Import(this.#node);
		this.AddPort(this.#import);
	}
}

export default class Session {
	static current: Session;

	readonly context: AudioContext;
	readonly destination: Destination;

	constructor() {
		this.context = Core.Station.context = new AudioContext();
		this.destination = new Destination(this.context.destination);
	}
}
