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

export default class Panel extends Control {
	readonly $header: HTMLElement;
	readonly $name: HTMLElement;
	readonly $resizer: HTMLElement;
	readonly content: Control;

	set size(size: Tensor) {
		this.element.style.width = `${size.components![0]}px`;
		this.element.style.height = `${size.components![1]}px`;
	}
	get size(): Tensor {
		return super.size;
	}

	get name(): string {
		return this.$name.innerText;
	}
	set name(value: string) {
		this.$name.innerText = value;
	}

	constructor(name: string) {
		super(document.createElement('section'));
		this.element.classList.add('panel');

		this.$header = document.createElement('header');
		this.element.append(this.$header);

		this.$name = document.createElement('p');
		this.$name.classList.add('name');
		this.$header.append(this.$name);

		this.name = name;

		this.content = new Control(document.createElement('main'));
		this.content.AttachTo(this);

		this.$resizer = document.createElement('div');
		this.$resizer.classList.add('resizer');
		this.element.append(this.$resizer);
		this.$resizer.addEventListener('mousedragmove', (event: MouseEvent) => {
			this.size = new Tensor([event.pageX, event.pageY]).Minus(this.position);
		});
	}
}
