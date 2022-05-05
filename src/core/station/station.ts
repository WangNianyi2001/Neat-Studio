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
	readonly node: AudioNode;
	readonly index: number;
	route: Route | null = null;

	constructor(node: AudioNode, index: number = 0) {
		this.node = node;
		this.index = index;
	}

	Disconnect() {
		this.route?.Close();
		this.route = null;
	}
}

class Plug extends Port {
	Connect(destination: Socket) {
		this.route = destination.route = new Route(this, destination);
	}
}

class Socket extends Port {
	Connect(source: Plug) {
		source.Connect(this);
	}
}

import Session from '../../session';

interface IStation {
	get sockets(): readonly Socket[];
	get plugs(): readonly Plug[];
	get length(): number;
}

abstract class Source implements IStation {
	readonly sockets: Socket[] = [];
	abstract get plugs(): readonly Plug[];
	abstract get length(): number;
}

class Destination implements IStation {
	readonly node: AudioNode;
	readonly sockets: Socket[];
	readonly plugs: Plug[] = [];
	readonly length = Infinity;

	constructor(session: Session) {
		this.node = session.context.destination;
		this.sockets = [new Socket(this.node)];
	}
}

export { IStation, Plug, Socket, Source, Destination };
