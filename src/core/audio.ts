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

class Delegate {
	readonly node: AudioNode;
	readonly index: number;

	constructor(node: AudioNode, index: number = 0) {
		this.node = node;
		this.index = index;
	}

	Connect(target: Delegate): void {
		this.node.connect(target.node, this.index, target.index);
	}

	Disconnect(target: Delegate): void {
		this.node.disconnect(target.node, this.index, target.index);
	}
}

export class Route extends Station.Route<Export, Import> {
	constructor(from: Export, to: Import) {
		super(from, to);
		this.from.delegate.Connect(this.to.delegate);
	}

	override Destroy(): void {
		this.from.delegate.Disconnect(this.to.delegate);
		super.Destroy();
	}
}

abstract class Port<Peer extends Export | Import> extends Station.Port<Peer, Route> {
	delegate: Delegate;

	constructor(node: AudioNode, index: number = 0) {
		super();
		this.delegate = new Delegate(node, index);
	}

	Replace(node: AudioNode, index: number = 0): void {
		const replacement = new Delegate(node, index);
		this.routes.forEach(route => {
			const peer = this.PeerOf(<Route>route);
			const [fromOld, toOld, fromNew, toNew] = this instanceof Export
				? [this.delegate, peer.delegate, replacement, peer.delegate]
				: [peer.delegate, this.delegate, peer.delegate, replacement];
			fromOld.Disconnect(toOld);
			fromNew.Connect(toNew);
		});
		this.delegate = replacement;
	}
	
	override Connect(target: Peer): void {
		if(this.ConnectedTo(target))
			return;
		Route.Connect(Export, Import, Route, this, target);
	}

	override Disconnect(target: Peer): void {
		if(!this.ConnectedTo(target))
			return;
		for(const route of this.routes) {
			if(!route.Has(target))
				continue;
			route.Destroy();
		}
	}
}

export class Export extends Port<Import> {
}

export class Import extends Port<Export> {
}

export { Oscillator } from './audio/oscillator';
export { Sampler } from './audio/sampler';
