import Tensor from '@util/tensor';
import { Entry } from './context-menu';

declare global {
	interface HTMLElement {
		control?: Control
	}
}

export default class Control extends EventTarget {
	static readonly resizeObserver = new ResizeObserver(function(entries) {
		for(const entry of entries) {
			const control = (entry.target as HTMLElement).control;
			if(!control)
				continue;
			control.dispatchEvent(new Event('resize'));
		}
	});
	readonly $outer: HTMLElement;
	readonly $inner: HTMLElement;
	parent: Control | null = null;
	#children: Control[] = [];
	get children(): Control[] {
		return this.#children.slice();
	}
	get size(): Tensor {
		return new Tensor([this.$outer.offsetWidth, this.$outer.offsetHeight]);
	}
	get position(): Tensor {
		return new Tensor([this.$outer.offsetLeft, this.$outer.offsetTop]);
	}
	get pagePosition(): Tensor {
		return new Tensor([this.$outer.clientLeft, this.$outer.clientTop]);
	}
	contextMenu: Entry | null = null;

	constructor($outer: HTMLElement, $inner: HTMLElement = $outer) {
		super();
		([this.$outer, this.$inner] = [$outer, $inner])
			.forEach($ => $.control = this);
		if($outer !== $inner && !$inner.FindInParent($ => $ === $outer))
			this.Add($inner, true, true);
		Control.resizeObserver.observe(this.$outer);
		this.$outer.addEventListener('contextmenu', (ev: Event) => {
			ev.preventDefault();
			ev.stopPropagation();
			this.contextMenu?.Show();
			return false;
		});
	}
	
	Destroy(): void {
		Control.resizeObserver.unobserve(this.$outer);
		this.$outer.parentNode?.removeChild(this.$outer);
		if(this.parent) {
			const index = this.parent.#children.indexOf(this);
			if(index !== -1)
				this.parent.#children.splice(index, 1);
		}
		for(const child of this.#children)
			child.Destroy();
	}

	Add(child: Control | HTMLElement, before: HTMLElement | boolean = false, outer: HTMLElement | boolean = false) {
		if(child instanceof Control)
			child = child.$outer;
		const $base = outer instanceof HTMLElement
			? outer
			: outer ? this.$outer : this.$inner;
		if(!(before instanceof HTMLElement)) {
			before = (before
				? $base.firstElementChild
				: $base.lastElementChild?.nextElementSibling
			) as HTMLElement;
		}
		$base.insertBefore(child, before);
		if(child.control)
			child.control.parent = this;
	}

	AttachTo(parent: Control | null, before: HTMLElement | boolean = false) {
		if(this.parent) {
			this.Destroy();
			this.parent = null;
		}
		parent?.Add(this, before);
	}
}
