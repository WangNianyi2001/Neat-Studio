import Station from './station';


export async function LoadFromFile(source: File): Promise<AudioBuffer> {
	const reader = new FileReader();
	reader.readAsArrayBuffer(source);
	const data = await await new Promise<Promise<ArrayBuffer | null>>(res => {
		reader.addEventListener('load', () =>
			res(new Promise<ArrayBuffer>(
				res => res(<ArrayBuffer>reader.result)
			))
		);
		reader.addEventListener('error', () =>
			res(Promise.reject<null>(null))
		);
	});
	if(data === null)
		throw new Error('Error when loading audio from file');
	const buffer = await await new Promise<Promise<AudioBuffer | null>>(res => {
		Station.context.decodeAudioData(
			data,
			audioBuffer => res(new Promise<AudioBuffer>(
				res => res(audioBuffer)
			)),
			() => res(Promise.reject<null>(null))
		);
	});
	if(buffer === null)
		throw new Error('Error when decoding audio data');
	return buffer;
}

abstract class Port<Peer extends Station.Port<any, Route>> extends Station.Port<Peer, Route> {
	node: AudioNode;
	index: number = 0;

	constructor(node: AudioNode, index: number = 0) {
		super();
		this.node = node;
		this.index = index;
	}

	abstract PeerOf(route: Route): Peer;

	abstract Replace(node: AudioNode, index: number): void;
}

export class Route extends Station.Route<Export, Import> {
	readonly from: Export;
	readonly to: Import;

	constructor(from: Export, to: Import) {
		super(from, to);
		[this.from, this.to] = [from, to]
		from.node.connect(to.node, from.index, to.index);
	}

	override Destroy(): void {
		super.Destroy();
		this.from.node.disconnect(this.to.node, this.from.index, this.to.index);
	}
}

export class Export extends Port<Import> {
	override Connect(target: Import): void {
		if(this.ConnectedTo(target))
			return;
		new Route(this, target);
	}

	override Disconnect(target: Import): void {
		if(!this.ConnectedTo(target))
			return;
		const route = [...this.routes].find(
			route => route.Has(target)
		)!;
		route.Destroy();
	}
	
	override PeerOf(route: Route): Import {
		return route.to;
	}

	override Replace(node: AudioNode, index: number = 0): void {
		this.routes.forEach(route => {
			const target = this.PeerOf(<Route>route);
			this.node.disconnect(target.node, this.index, target.index);
			node.connect(target.node, index, target.index);
		});
		this.node = node;
		this.index = index;
	}
}

export class Import extends Port<Export> {
	override Connect(target: Export): void {
		target.Connect(this);
	}

	override Disconnect(target: Export): void {
		target.Disconnect(this);
	}
	
	override PeerOf(route: Route): Export {
		return route.from;
	}

	override Replace(node: AudioNode, index: number = 0): void {
		this.routes.forEach(route => {
			const target = this.PeerOf(<Route>route);
			target.node.disconnect(this.node, target.index, this.index);
			target.node.connect(node, target.index, index);
		});
		this.node = node;
		this.index = index;
	}
}

export { Oscillator } from './audio/oscillator';
export { Sampler } from './audio/sampler';
