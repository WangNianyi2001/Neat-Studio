import './dummy';

declare global {
	interface HTMLElement {
		FindInParent(
			this: HTMLElement, predicate: (_: HTMLElement) => boolean
		): HTMLElement | null;
	}
}

HTMLElement.prototype.FindInParent = function FindInParent(
	this: HTMLElement, predicate: (_: HTMLElement) => boolean
): HTMLElement | null {
	for(
		let current: HTMLElement | null = this;
		current !== null;
		current = current.parentElement) {
		if(predicate(current))
			return current;
	}
	return null;
}
