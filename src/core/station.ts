abstract class Station {
	static context: AudioContext;

	exports: Station.Port[] = [];
	imports: Station.Port[] = [];

	abstract get length(): number;

	protected AddExport(port: Station.Port): void {
		if(this.exports.indexOf(port) !== -1)
			return;
		this.exports.push(port);
	}
	protected AddImport(port: Station.Port): void {
		if(this.imports.indexOf(port) !== -1)
			return;
		this.imports.push(port);
	}

	protected RemoveExport(port: Station.Port): void {
		const index = this.exports.indexOf(port);
		if(index === -1)
			return;
		this.exports.splice(index, 1);
	}
	protected RemoveImport(port: Station.Port): void {
		const index = this.imports.indexOf(port);
		if(index === -1)
			return;
		this.imports.splice(index, 1);
	}

	GetExportsOfType(dataType: Symbol): Station.Port[] {
		return this.exports.filter(port => port.dataType === dataType);
	}
	GetImportsOfType(dataType: Symbol): Station.Port[] {
		return this.imports.filter(port => port.dataType === dataType);
	}
}

module Station {
	export enum PortType {
		Import, Export
	};

	const portTypeDefaultName = new Map<PortType, string>([
		[PortType.Import, 'Input'],
		[PortType.Export, 'Output'],
	]);

	export abstract class Port {
		readonly type: PortType;
		readonly dataType: Symbol;
		name: string;
		routes: Set<Route>;

		constructor(dataType: Symbol, type: PortType, name?: string) {
			if(name === undefined)
				name = portTypeDefaultName.get(type);
			this.name = name!;
			this.dataType = dataType;
			this.type = type;
			this.routes = new Set<Route>();
		}

		abstract Connect(target: Port): void;

		abstract Disconnect(target: Port): void;

		RoutesTo(target: Port): Set<Route> {
			const set = new Set<Route>();
			for(const route of this.routes) {
				if(route.Has(target))
					set.add(route);
			}
			return set;
		}

		ConnectedTo(target: Port): boolean {
			for(const route of this.routes) {
				if(route.Has(target))
					return true;
			}
			return false;
		}

		PeerOf(route: Route): Port {
			return route.PeerOf(this)!;
		}
	};
	
	export class Route {
		readonly #from: Port;
		public get from(): Port { return this.#from; }
		readonly #to: Port;
		public get to(): Port { return this.#to; }

		constructor(from: Port, to: Port) {
			[this.#from, this.#to] = [from, to];
			[this.from, this.to].forEach(port => port.routes.add(this));
		}
		
		Destroy(): void {
			this.from.routes.delete(this);
			this.to.routes.delete(this);
		}

		Has(port: Port): boolean {
			return this.from === port || this.to === port;
		}

		PeerOf(port: Port) : Port | null {
			if(!this.Has(port))
				return null;
			return port === this.from ? this.to : this.from;
		}
	};
}

export default Station;
