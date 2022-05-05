import { Destination } from "./core/station/station";

class Session {
	static current: Session;

	context: AudioContext;
	destination: Destination;

	constructor() {
		this.context = new AudioContext();
		this.destination = new Destination(this);
	}
}

export default Session;
