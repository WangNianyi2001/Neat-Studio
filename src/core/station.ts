import { Type } from '@neat/utility';

abstract class Station {
	static context: AudioContext;

	ports: Station.Port<any>[] = [];

	abstract get length(): number;

	protected AddPort(port: Station.Port<any>): void {
		if(this.ports.indexOf(port) !== -1)
			return;
		this.ports.push(port);
	}

	protected RemovePort(port: Station.Port<any>): void {
		const index = this.ports.indexOf(port);
		if(index === -1)
			return;
		this.ports.splice(index, 1);
	}

	GetPortsOfType<Port extends Station.Port<any>>(type: Type<Port>): Port[] {
		return <Port[]>this.ports.filter(port => port instanceof type);
	}
}

module Station {
	export abstract class Connection {
		ports: Port<any>[];

		constructor(parts: Port<any>[]) {
			this.ports = parts.slice();
			parts.forEach(port => port.connections.push(this));
		}

		Destroy(): void {
			this.ports.forEach(port => {
				const index = port.connections.indexOf(this);
				port.connections.splice(index, 1);
			});
		}

		HasAll(ports: Port<any>[]): boolean {
			return ports.every(port => this.ports.indexOf(port) !== -1);
		}
	}

	export abstract class Port<Peer extends Port<any>> {
		connections: Connection[] = [];

		abstract Connect(target: Peer): void;
		abstract Disconnect(target: Peer): void;

		ConnectionsTo(targets: Peer[]): Connection[] {
			const _targets: Port<any>[] = targets.slice();
			_targets.push(this);
			return this.connections.filter(connection => connection.HasAll(_targets));
		}
		ConnectedTo(targets: Peer[]): boolean {
			return this.ConnectionsTo(targets).length != 0;
		}
	}
}

export default Station;
