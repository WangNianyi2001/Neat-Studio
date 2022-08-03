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
	readonly $: HTMLElement;
	parent: Control | null = null;
	#children: Control[] = [];
	get children(): Control[] {
		return this.#children.slice();
	}
	get size(): Tensor {
		return new Tensor([this.$.offsetWidth, this.$.offsetHeight]);
	}
	get position(): Tensor {
		return new Tensor([this.$.offsetLeft, this.$.offsetTop]);
	}
	get pagePosition(): Tensor {
		return new Tensor([this.$.clientLeft, this.$.clientTop]);
	}

	constructor(element: HTMLElement) {
		super();
		this.$ = element;
		this.$.control = this;
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
				base = this.parent.$;
			base.appendChild(this.$);
		}
	}
	
	Destroy(): void {
		this.$.parentNode?.removeChild(this.$);
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
