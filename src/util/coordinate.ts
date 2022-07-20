import Tensor from "./tensor";

export function RelativePosition(target: HTMLElement, anchor: HTMLElement): Tensor {
	let local = new Tensor([0, 0]);
	for(let current: HTMLElement | null = target;
		current instanceof HTMLElement && current !== anchor;
		current = current.offsetParent as HTMLElement)
		local = local.Plus(new Tensor([current.offsetLeft, current.offsetTop]));
	return local;
}
