declare global {
	interface Element {
		control: Control | null
	}
}

export default class Control {
	readonly element: Element;
	parent: Control | null = null;
	#children: Control[] = [];
	get children(): Control[] {
		return this.#children.slice();
	}

	constructor(
		element: Element
	) {
		this.element = element;
		this.element.control = this;
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
	}
}
