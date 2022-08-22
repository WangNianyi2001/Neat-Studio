import * as Core from './core';
import Destination from '@core/audio/destination';
import PanelManager from '@ui/panel-manager';

export default class Session {
	static current: Session | null = null;

	readonly context!: AudioContext;
	readonly destination!: Destination;
	readonly panelManager: PanelManager = new PanelManager();

	constructor() {
		if(Session.current !== null)
			return Session.current;
		Session.current = this;
		this.context = Core.Station.context = new AudioContext();
		this.destination = new Destination(this.context.destination);
	}
}
