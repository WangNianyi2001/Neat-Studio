import { Control } from '../ui';
import './panel.scss';

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

		this.element.addEventListener('mousedown', () => {
			const mousemove = (event: MouseEvent) => {
				const pos = this.panel.position;
				this.panel.size = [
					event.pageX - pos[0],
					event.pageY - pos[1]
				];
			};
			document.body.addEventListener('mousemove', mousemove);
			window.addEventListener(
				'mouseup',
				() => document.body.removeEventListener('mousemove', mousemove),
				{ once: true }
			);
		});
	}
}

export default class Panel extends Control {
	readonly header: Header;
	readonly content: Control;
	readonly resizer: Resizer;

	set size(size: number[]) {
		this.element.style.width = `${size[0]}px`;
		this.element.style.height = `${size[1]}px`;
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
