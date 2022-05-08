import { Type } from '@neat/utility';

abstract class Station {
	static context: AudioContext;

	ports: Station.Port<any, any>[] = [];

	abstract get length(): number;

	protected AddPort(port: Station.Port<any, any>): void {
		if(this.ports.indexOf(port) !== -1)
			return;
		this.ports.push(port);
	}

	protected RemovePort(port: Station.Port<any, any>): void {
		const index = this.ports.indexOf(port);
		if(index === -1)
			return;
		this.ports.splice(index, 1);
	}

	GetPortsOfType<Port extends Station.Port<any, any>>(type: Type<Port>): Port[] {
		return <Port[]>this.ports.filter(port => port instanceof type);
	}
}

module Station {
	export class Route<
		From extends Port<any, any>,
		To extends Port<any, any>
	> {
		readonly from: From;
		readonly to: To;

		constructor(from: From, to: To) {
			if(from.ConnectedTo(to))
				throw new Error('Cannot connect two already conencted ports');
			this.from = from;
			this.to = to;
			this.from.routes.add(this);
			this.to.routes.add(this);
		}

		Destroy(): void {
			this.from.routes.delete(this);
			this.to.routes.delete(this);
		}

		Has(port: From | To): boolean {
			return this.from === port || this.to === port;
		}
	}

	export abstract class Port<
		Peer extends Port<any, any>,
		Route extends Station.Route<any, any>
	> {
		routes: Set<Route>;

		constructor() {
			this.routes = new Set<Route>();
		}

		abstract Connect(target: Peer): void;
		abstract Disconnect(target: Peer): void;

		RoutesTo(target: Peer): Set<Route> {
			return new Set([...this.routes]
				.filter(route => route.Has(target))
			);
		}

		ConnectedTo(target: Peer): boolean {
			return this.RoutesTo(target).size != 0;
		}
	}
}

export default Station;
