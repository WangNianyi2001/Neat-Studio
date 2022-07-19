import Tensor from './tensor';

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

	constructor(type: MouseDragEventType, data: {
		event: MouseEvent,
		start: Tensor,
		pagePos: Tensor
	}) {
		super(type, data.event);
		this.#start = data.start.Copy();
		this.#pagePos = data.pagePos.Copy();
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
	let start = new Tensor([ev.pageX, ev.pageY]);
	$target.dispatchEvent(new MouseDragEvent('mousedragstart', { event: ev, start, pagePos: start }));
	const OnMouseMove = function(this: HTMLElement, ev: MouseEvent) {
		let pagePos = new Tensor([ev.pageX, ev.pageY]);
		$target.dispatchEvent(new MouseDragEvent('mousedragmove', { event: ev, start, pagePos }));
	};
	document.body.addEventListener('mousemove', OnMouseMove);
	window.addEventListener('mouseup',
		(ev: MouseEvent) => {
			document.body.removeEventListener('mousemove', OnMouseMove);
			let pagePos = new Tensor([ev.pageX, ev.pageY]);
			$target.dispatchEvent(new MouseDragEvent('mousedragend', { event: ev, start, pagePos }));
		},
		{ once: true }
	);
});
