import * as UI from '../ui';

export default class Panel extends UI.Control {
	constructor() {
		const $ = document.createElement('div');
		$.classList.add('panel');
		super($, UI.root);
	}
}
