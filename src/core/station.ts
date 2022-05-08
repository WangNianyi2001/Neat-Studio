import { Type } from '@neat/utility';

abstract class Station {
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

declare module Station {
	export interface Port<Peer extends Port<any>> {
		Connect(target: Peer): void;
		Disconnect(target: Peer): void;
	}
}

export default Station;
