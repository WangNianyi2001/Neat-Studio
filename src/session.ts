import * as Core from './core';
import Destination from '@core/audio/destination';

export default class Session {
	static current: Session | null = null;

	readonly context!: AudioContext;
	readonly destination!: Destination;
	readonly graph!: Core.Graph;

	constructor() {
		if(Session.current !== null)
			return Session.current;
		Session.current = this;
		this.context = Core.Station.context = new AudioContext();
		this.destination = new Destination(this.context.destination);
		this.graph = new Core.Graph();
		this.graph.Add(this.destination);
	}
}
