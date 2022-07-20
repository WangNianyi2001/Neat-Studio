import Tensor from './tensor';
import * as UI from '@neat/ui';

type MouseDragEventType = 'mousedragstart' | 'mousedragmove' | 'mousedragend';

export class MouseDragEvent extends MouseEvent {
	readonly #start: Tensor;
	get start(): Tensor {
		return this.#start.Copy();
	}
	readonly #pagePos: Tensor;
	get pagePos(): Tensor {
		return this.#pagePos.Copy();
	}
	get offset(): Tensor {
		return this.#pagePos.Minus(this.#start);
	}
	readonly $drop: HTMLElement | null = null;

	constructor(type: MouseDragEventType, data: {
		event: MouseEvent,
		start: Tensor,
		pagePos: Tensor,
		$drop?: HTMLElement | null
	}) {
		super(type, data.event);
		this.#start = data.start.Copy();
		this.#pagePos = data.pagePos.Copy();
		if(data.$drop instanceof HTMLElement)
			this.$drop = data.$drop;
	}
}

declare global {
	export interface HTMLElement {
		addEventListener(event: MouseDragEventType, listener: Function, option?: AddEventListenerOptions): void;
		removeEventListener(event: MouseDragEventType, listener: Function, options?: boolean | EventListenerOptions): void;
	}
}

document.body.addEventListener('mousedown', function(ev: MouseEvent) {
	const $target = ev.target as HTMLElement;
	const $root = UI.root.$;
	let start = new Tensor([ev.pageX, ev.pageY]);
	$target.dispatchEvent(new MouseDragEvent('mousedragstart', { event: ev, start, pagePos: start }));
	const OnMouseMove = function(this: HTMLElement, ev: MouseEvent) {
		let pagePos = new Tensor([ev.pageX, ev.pageY]);
		$target.dispatchEvent(new MouseDragEvent('mousedragmove', { event: ev, start, pagePos }));
	};
	$root.addEventListener('mousemove', OnMouseMove);
	const OnMouseUp = (ev: MouseEvent) => {
		$root.removeEventListener('mousemove', OnMouseMove);
		let pagePos = new Tensor([ev.pageX, ev.pageY]);
		$target.dispatchEvent(new MouseDragEvent('mousedragend', {
			event: ev, start,
			pagePos,
			$drop: ev.target as HTMLElement
		}));
		$root.removeEventListener('mouseup', OnMouseUp);
	};
	$root.addEventListener('mouseup', OnMouseUp);
});
