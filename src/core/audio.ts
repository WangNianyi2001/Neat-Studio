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

export const dataType: symbol = Symbol('audio');

export class Port extends Station.Port {
	delegate: Delegate;

	constructor(node: AudioNode, type: Station.PortType, index: number = 0, name?: string) {
		super(dataType, type, name);
		this.delegate = new Delegate(node, index);
	}

	Replace(node: AudioNode, index: number = 0): void {
		const replacement = new Delegate(node, index);
		this.routes.forEach(route => {
			const peer = this.PeerOf(<Route>route) as Port;
			this.delegate.Disconnect(peer.delegate);
			replacement.Connect(peer.delegate);
		});
		this.delegate = replacement;
	}
	
	override Connect(target: Port): void {
		if(this.ConnectedTo(target))
			return;
		this.routes.add(new Route(this, target));
	}

	override Disconnect(target: Port): void {
		if(!this.ConnectedTo(target))
			return;
		for(const route of this.routes) {
			if(!route.Has(target))
				continue;
			route.Destroy();
		}
	}
}

export class Route extends Station.Route {
	get from(): Port { return super.from as Port; }
	get to(): Port { return super.to as Port; }

	constructor(from: Port, to: Port) {
		super(from, to);
		this.from.delegate.Connect(this.to.delegate);
	}

	override Destroy(): void {
		this.from.delegate.Disconnect(this.to.delegate);
		super.Destroy();
	}
}

export { Oscillator } from './audio/oscillator';
export { Sampler } from './audio/sampler';
