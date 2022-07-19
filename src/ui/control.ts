import Tensor from '@util/tensor';

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
		control?: Control
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
	get position(): Tensor {
		return new Tensor([this.element.offsetLeft, this.element.offsetTop]);
	}

	constructor(element: HTMLElement) {
		super();
		this.element = element;
		this.element.control = this;
		manager.Register(this);
	}

	AttachTo(parent: Control | null, base: HTMLElement | null = null) {
		if(this.parent) {
			this.Destroy();
			this.parent = null;
		}
		if(parent) {
			this.parent = parent;
			if(!base)
				base = this.parent.element;
			base.appendChild(this.element);
		}
	}
	
	Destroy(): void {
		this.element.parentNode?.removeChild(this.element);
		if(this.parent) {
			const index = this.parent.#children.indexOf(this);
			if(index !== -1)
				this.parent.#children.splice(index, 1);
		}
		for(const child of this.#children)
			child.Destroy();
		manager.Unregister(this);
	}
}
