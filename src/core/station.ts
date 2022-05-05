namespace Neat.Core {
	export interface Station {
		get imports(): readonly Station.Import<any>[];
		get exports(): readonly Station.Export<any>[];
		get length(): number;
	}

	export namespace Station {
		export interface Port<Peer extends Port<any>> {
			get peer(): Peer | null;
		}

		export interface Import<
			Peer extends Export<any>
		> extends Port<Peer> {
			Disconnect(): void;
		}
		
		export interface Export<
			Peer extends Import<any>
		> extends Port<Peer> {
			Connect(destination: Peer): void;
		}
	}
}
