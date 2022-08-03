import Station from '@core/station';
import * as Audio from '@core/audio';

export default class Destination extends Station {
	readonly #node: AudioDestinationNode;
	readonly #import: Audio.Port;

	readonly length = Infinity;

	constructor(node: AudioDestinationNode) {
		super();
		this.#node = node;
		this.#import = new Audio.Port(this.#node, Station.PortType.Import);
		this.AddImport(this.#import);
	}
}
