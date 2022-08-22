import Panel from './panel';
import Tensor from '@neat/util/tensor';

class PanelManager {
	panels = new Set<Panel>();
	readonly #creationPositionStep = new Tensor([32, 32]);
	#creationPosition = new Tensor([0, 0]);

	constructor() {}

	Register(panel: Panel) {
		this.panels.add(panel);
		panel.position = this.#creationPosition;
		this.#creationPosition = this.#creationPosition.Plus(this.#creationPositionStep);
	}

	Unregister(panel: Panel) {
		this.panels.delete(panel);
	}
};

export default new PanelManager();