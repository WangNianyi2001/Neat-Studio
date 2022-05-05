class Route {
	plug: Plug;
	socket: Socket;

	constructor(plug: Plug, socket: Socket) {
		this.plug = plug;
		this.socket = socket;
		this.plug.node.connect(
			this.socket.node,
			this.plug.index,
			this.socket.index
		);
		console.log(this.plug.node);
	}

	Close() {
		this.plug.node.disconnect(
			this.socket.node,
			this.plug.index,
			this.socket.index
		);
	}
}

abstract class Port {
	readonly station: Station;
	readonly channelCount: number;
	readonly index: number;
	route: Route | null = null;

	constructor(station: Station, channelCount: number, index: number = 0) {
		this.station = station;
		this.channelCount = channelCount;
		this.index = index;
	}
	abstract get node(): AudioNode;
}

class Plug extends Port {
	override get node(): AudioNode {
		return this.station.outNode!;
	}

	Connect(destination: Socket) {
		this.route = destination.route = new Route(this, destination);
	}
}

class Socket extends Port {
	override get node(): AudioNode {
		return this.station.inNode!;
	}

	Connect(source: Plug) {
		source.Connect(this);
	}
}

import Session from '../../session';

abstract class Station {
	readonly session: Session;
	abstract get inNode(): AudioNode | null;
	abstract get outNode(): AudioNode | null;
	abstract get sockets(): readonly Socket[];
	abstract get plugs(): readonly Plug[];
	abstract get length(): number;

	constructor(session: Session) {
		this.session = session;
	}
}

abstract class Source extends Station {
	readonly inNode = null;
	abstract get outNode(): AudioNode;
	sockets: readonly Socket[] = [];
	abstract get plugs(): readonly Plug[];
	abstract get length(): number;
}

class Destination extends Station {
	readonly inNode: AudioNode;
	readonly outNode = null;
	sockets: readonly Socket[];
	plugs: readonly Plug[] = [];
	length = Infinity;

	constructor(session: Session) {
		super(session);
		this.inNode = session.context.destination;
		this.sockets = [new Socket(this, 2)];
	}
}

export { Station, Plug, Socket, Source, Destination };
