import Station from './station';

class Delegate {
	readonly node: AudioNode;
	readonly index: number;

	constructor(node: AudioNode, index: number) {
		this.node = node;
		this.index = index;
	}

	Connect(target: Delegate): void {
		this.node.connect(target.node, this.index, target.index);
	}

	Disconnect(target: Delegate): void {
		this.node.disconnect(target.node, this.index, target.index);
	}
}

abstract class Port<Peer extends Station.Port<any>> implements Station.Port<Peer> {
	readonly port: Delegate;

	constructor(node: AudioNode, index: number = 0) {
		this.port = new Delegate(node, index);
	}
	abstract Connect(target: Peer): void;
	abstract Disconnect(target: Peer): void;
}

export class Export extends Port<Import> implements Station.Port<Import> {
	override Connect(target: Import): void {
		this.port.Connect(target.port);
	}
	override Disconnect(target: Import): void {
		this.port.Disconnect(target.port);
	}
}

export class Import extends Port<Export> implements Station.Port<Export> {
	override Connect(target: Export): void {
		target.Connect(this);
	}
	override Disconnect(target: Export): void {
		target.Disconnect(this);
	}
}

export { Oscillator } from './audio/oscillator';
