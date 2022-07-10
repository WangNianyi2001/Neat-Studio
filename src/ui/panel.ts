import { Control } from '../ui';
import './panel.scss';
import Tensor from '@util/tensor';
import '@util/mousedrag';

class Manager {
	static instance: Manager | null = null;

	constructor() {
		if(Manager.instance !== null)
			return Manager.instance;
		Manager.instance = this;
	}
}

export const manager: Manager = new Manager();

export class Header extends Control {
	#$name: HTMLElement;
	get name(): string {
		return this.#$name.innerText;
	}
	set name(value: string) {
		this.#$name.innerText = value;
	}

	constructor(panel: Panel, name: string) {
		const element = document.createElement('header');
		super(element);
		this.#$name = document.createElement('p');
		this.#$name.classList.add('name');
		this.element.append(this.#$name);
		this.name = name;
		this.parent = panel;
		this.AttachTo(panel, panel.children[0] || null);
	}
}

class Resizer {
	readonly panel: Panel;
	readonly element: HTMLElement;

	constructor(panel: Panel) {
		this.panel = panel;
		this.element = document.createElement('div');
		this.element.classList.add('resizer');
		this.panel.element.append(this.element);

		this.element.addEventListener('mousedragmove', (event: MouseEvent) => {
			this.panel.size = new Tensor([event.pageX, event.pageY]).Minus(this.panel.pagePos);
		});
	}
}

export default class Panel extends Control {
	readonly header: Header;
	readonly content: Control;
	readonly resizer: Resizer;

	set size(size: Tensor) {
		this.element.style.width = `${size.components![0]}px`;
		this.element.style.height = `${size.components![1]}px`;
	}
	get size(): Tensor {
		return super.size;
	}

	constructor(name: string) {
		const element = document.createElement('section');
		element.classList.add('panel');

		super(element);

		this.header = new Header(this, name);

		this.content = new Control(document.createElement('main'));
		this.Attach(this.content);

		this.resizer = new Resizer(this);
	}
}
