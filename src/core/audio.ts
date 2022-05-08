import Station from './station';

abstract class Port<Peer extends Station.Port<any>> extends Station.Port<Peer> {
	node: AudioNode;
	index: number = 0;

	constructor(node: AudioNode, index: number = 0) {
		super();
		this.node = node;
		this.index = index;
	}

	abstract Replace(node: AudioNode, index: number): void;
}

export class Connection extends Station.Connection {
	constructor(from: Export, to: Import) {
		super([from, to]);
		from.node.connect(to.node, from.index, to.index);
	}

	override Destroy(): void {
		super.Destroy();
		const [from, to] = <Port<any>[]>this.ports;
		from.node.disconnect(to.node, from.index, to.index);
	}
}

export class Export extends Port<Import> {
	Connect(target: Import): void {
		if(this.ConnectedTo([target]))
			return;
		new Connection(this, target);
	}

	Disconnect(target: Import): void {
		if(!this.ConnectedTo([target]))
			return;
		const connection = this.connections.find(
			connection => connection.HasAll([target])
		)!;
		connection.Destroy();
	}

	override Replace(node: AudioNode, index: number = 0): void {
		const targets = (<Connection[]>this.connections).map(connection => {
			const target = <Import>connection.ports[1];
			connection.Destroy();
			return target;
		});
		this.node = node;
		this.index = index;
		targets.forEach(target => new Connection(this, target));
	}
}

export class Import extends Port<Export> {
	Connect(target: Export): void {
		target.Connect(this);
	}

	Disconnect(target: Export): void {
		target.Disconnect(this);
	}

	override Replace(node: AudioNode, index: number = 0): void {
		const targets = (<Connection[]>this.connections).map(connection => {
			const target = <Import>connection.ports[0];
			connection.Destroy();
			return target;
		});
		this.node = node;
		this.index = index;
		targets.forEach(target => new Connection(target, this));
	}
}

export { Oscillator } from './audio/oscillator';
export { Sampler } from './audio/sampler';
export { Sample } from './audio/sample';
