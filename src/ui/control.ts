declare global {
	interface Element {
		control: Control | null
	}
}

export default class Control {
	readonly element: Element;
	readonly content: Element;
	parent: Control | null = null;

	constructor(
		element: Element,
		content: Element = element,
		parent: Control | null = null
	) {
		this.element = element;
		this.element.control = this;
		this.content = content;
		if(parent !== null)
			this.AttachTo(parent);
	}

	AttachTo(parent: Control) {
		if(this.parent) {
			this.parent.Remove(this);
			this.parent = null;
		}
		parent.content.appendChild(this.element);
		this.parent = parent;
	}

	Remove(child: Control) {
		this.content.removeChild(child.element);
	}

	Destroy(): void {
		this.parent?.Remove(this);
	}
}
