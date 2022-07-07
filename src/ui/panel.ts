import * as UI from '../ui';

export default class Panel extends UI.Control {
	constructor() {
		const element = document.createElement('div');
		element.classList.add('panel');
		const content = document.createElement('div');
		element.appendChild(content);
		super(element, content, UI.workspace);
	}
}
