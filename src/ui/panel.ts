import { Control } from '../ui';
import '../stylesheet/panel.scss';

export class Header extends Control {
	get name(): string {
		return (this.element as HTMLElement).innerText;
	}
	set name(value: string) {
		(this.element as HTMLElement).innerText = value;
	}

	constructor(panel: Panel, name: string) {
		const element = document.createElement('header');
		super(element);
		this.name = name;
		this.parent = panel;
		this.AttachTo(panel, panel.children[0] || null);
	}
}

export default class Panel extends Control {
	readonly header: Header;
	readonly content: Control;
	
	constructor(name: string) {
		const element = document.createElement('section');
		element.classList.add('panel');

		super(element);
		this.header = new Header(this, name);
		this.content = new Control(document.createElement('main'));
		this.Attach(this.content);
	}
}
