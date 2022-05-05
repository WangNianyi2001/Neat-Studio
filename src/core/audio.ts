/// <reference path="./station.ts" />

namespace Neat.Core.Audio {
	class Delegate {
		readonly node: AudioNode;
		readonly index: number;

		constructor(node: AudioNode, index: number) {
			this.node = node;
			this.index = index;
		}

		Connect(target: Delegate) {
			this.node.connect(target.node, this.index, target.index);
		}

		Disconnect(target: Delegate) {
			this.node.disconnect(target.node, this.index, target.index);
		}
	}

	class Port<Peer extends Station.Port<any>> implements Station.Port<Peer> {
		readonly port: Delegate;
		peer: Peer | null = null;

		constructor(node: AudioNode, index: number = 0) {
			this.port = new Delegate(node, index);
		}
	}

	export class Export extends Port<Import> implements Station.Export<Import> {
		Connect(destination: Import) {
			this.port.Connect(destination.port);
		}
	}

	export class Import extends Port<Export> implements Station.Import<Export> {
		Disconnect() {
			if(this.peer === null)
				return;
			this.port.Connect(this.peer.port);
			this.peer = null;
		}
	}
}
