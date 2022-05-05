/// <reference path="../audio.ts" />

namespace Neat.Core.Audio {
	export class Oscillator implements Station {
		node: OscillatorNode;

		readonly imports: Station.Import<any>[] = [];
		readonly exports: Station.Export<any>[];
		length = Infinity;

		constructor(session: Session) {
			this.node = new OscillatorNode(session.context);
			this.exports = [new Export(this.node)];
		}
	}
}
