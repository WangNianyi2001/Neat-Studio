import Tensor from '@util/tensor';

declare global {
	interface HTMLElement {
		control?: Control
	}
}

const resizeObserver = new ResizeObserver(function(entries) {
	for(const entry of entries) {
		const control = (entry.target as HTMLElement).control;
		if(!control)
			continue;
		control.dispatchEvent(new Event('resize'));
	}
});

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
		resizeObserver.observe(this.$);
	}
	
	Destroy(): void {
		resizeObserver.unobserve(this.$);
		this.$.parentNode?.removeChild(this.$);
		if(this.parent) {
			const index = this.parent.#children.indexOf(this);
			if(index !== -1)
				this.parent.#children.splice(index, 1);
		}
		for(const child of this.#children)
			child.Destroy();
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
}
