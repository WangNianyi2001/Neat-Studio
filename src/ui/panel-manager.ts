import Panel from './panel';
import Tensor from '@neat/util/tensor';
import * as UI from '@neat/ui';

export default class PanelManager {
	panels = new Set<Panel>();
	readonly #creationPositionStep = new Tensor([28, 28]);
	#creationPosition = new Tensor([0, 0]);

	constructor() {}

	Register(panel: Panel) {
		this.panels.add(panel);
		panel.AttachTo(UI.root);
		panel.position = this.#creationPosition;
		this.#creationPosition = this.#creationPosition
			.Plus(this.#creationPositionStep)
			.Modulo(UI.root.outerSize.Minus(panel.outerSize));
	}

	Unregister(panel: Panel) {
		this.panels.delete(panel);
	}
};
