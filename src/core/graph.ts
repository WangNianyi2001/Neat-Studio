import Station from './station';

export default class Graph {
	#stations: Set<Station>;
	get stations(): Set<Station> {
		return new Set(this.#stations);
	}

	constructor() {
		this.#stations = new Set<Station>();
	}

	Add(station: Station) {
		this.#stations.add(station);
	}

	Remove(station: Station) {
		this.#stations.delete(station);
	}
};
