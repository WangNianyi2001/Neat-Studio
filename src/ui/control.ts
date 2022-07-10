import Tensor from '@tensor';

class Info {
	control: Control;
	size: Tensor;

	constructor(control: Control) {
		this.control = control;
		this.size = this.control.size;
	}
}

class Manager {
	static instance: Manager | null = null;

	controls: Map<Control, Info> = new Map<Control, Info>();

	Register(control: Control): void {
		this.controls.set(control, new Info(control));
	}
	Unregister(control: Control): void {
		this.controls.delete(control);
	}

	OnFrame() {
		for(const [control, info] of this.controls.entries()) {
			const size = control.size;
			if(!info.size.Equal(size)) {
				control.dispatchEvent(new Event('resize'));
				info.size = size;
			}
		}
		requestAnimationFrame(this.OnFrame.bind(this));
	}

	constructor() {
		if(Manager.instance !== null)
			return Manager.instance;
		Manager.instance = this;
		this.OnFrame();
	}
};

export const manager = new Manager();

declare global {
	interface HTMLElement {
		control: Control | null
	}
}

export default class Control extends EventTarget {
	readonly element: HTMLElement;
	parent: Control | null = null;
	#children: Control[] = [];
	get children(): Control[] {
		return this.#children.slice();
	}
	get size(): Tensor {
		return new Tensor([this.element.offsetWidth, this.element.offsetHeight]);
	}
	get pagePos(): Tensor {
		return new Tensor([this.element.offsetLeft, this.element.offsetTop]);
	}

	constructor(element: HTMLElement) {
		super();
		this.element = element;
		this.element.control = this;
		manager.Register(this);
	}

	AttachTo(parent: Control | null, before: Control | null = null) {
		if(this.parent) {
			this.parent.Remove(this);
			this.parent = null;
		}
		parent?.Attach(this, before);
	}
	Attach(control: Control, before: Control | null = null) {
		control.parent = this;
		let index: number = this.#children.length;
		if(before != null) {
			const foundIndex = control.#children.indexOf(before);
			if(foundIndex !== -1)
				index = foundIndex;
		}
		if(index === this.#children.length)
			this.element.appendChild(control.element);
		else
			this.element.insertBefore(control.element, this.children[index]?.element);
	}
	Remove(child: Control) {
		try {
			this.element.removeChild(child.element);
			const index = this.#children.indexOf(child);
			if(index !== -1)
				this.#children.splice(index, 1);
		} catch {}
	}
	Destroy(): void {
		this.parent?.Remove(this);
		for(const child of this.#children)
			child.Destroy();
		manager.Unregister(this);
	}
}
