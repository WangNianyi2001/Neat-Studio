import Station from '@core/station';

export class Sample {
	readonly buffer: AudioBuffer;

	constructor(buffer: AudioBuffer) {
		this.buffer = buffer;
	}

	static async LoadFromFile(source: File): Promise<Sample> {
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
		return new Sample(buffer);
	}
}
