/// <reference path="./core.ts" />

namespace Neat.Core {
	class Destination implements Station {
		get imports(): readonly Station.Import<any>[] {
			throw new Error("Method not implemented.");
		}
		readonly exports: Station.Export<any>[] = [];
		readonly length = Infinity;

		constructor(node: AudioDestinationNode) {
		}
	}

	export class Session {
		static current: Session;
	
		readonly context: AudioContext;
		readonly destination: Destination;
	
		constructor() {
			this.context = new AudioContext();
			this.destination = new Destination(this.context.destination);
		}
	}
}
