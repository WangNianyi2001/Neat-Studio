import { Type } from '@util/type';

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
			[this.from, this.to] = [from, to];
			[this.from, this.to].forEach(port => port.routes.add(this));
		}

		static Connect<
			From extends Port<any, any>,
			To extends Port<any, any>
		>(
			tFrom: Type<From>, tTo: Type<To>, tRoute: Type<Route<From, To>>,
			a: From | To, b: From | To
		): Route<From, To> | null {
			const typeOk = (a instanceof tFrom) !== (b instanceof tFrom) && (a instanceof tTo) !== (b instanceof tTo);
			if(!typeOk)
				return null;
			if(b instanceof tFrom)
				[a, b] = [b, a];
			const [from, to] = [<From>a, <To>b];
			return new tRoute(from, to);
		}
		
		Destroy(): void {
			this.from.routes.delete(this);
			this.to.routes.delete(this);
		}

		Has(port: From | To): boolean {
			return this.from === port || this.to === port;
		}

		PeerOf(port: From | To) : From | To | null {
			if(!this.Has(port))
				return null;
			return port === this.from ? this.to : this.from;
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
			const set = new Set<Route>();
			for(const route of this.routes) {
				if(route.Has(target))
					set.add(route);
			}
			return set;
		}

		ConnectedTo(target: Peer): boolean {
			for(const route of this.routes) {
				if(route.Has(target))
					return true;
			}
			return false;
		}

		PeerOf(route: Route): Peer {
			return <Peer>route.PeerOf(this)!;
		}
	}
}

export default Station;
