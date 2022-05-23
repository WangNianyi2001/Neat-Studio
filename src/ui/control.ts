export default class Control {
	readonly $: Element;
	get parent(): Node | null {
		return this.$.parentNode;
	}

	constructor($: Element, parent: Control | null = null) {
		this.$ = $;
		if(parent !== null)
			this.AttachTo(parent);
	}

	AttachTo(parent: Control) {
		parent.$.appendChild(this.$);
	}

	Destroy(): void {
		this.parent?.removeChild(this.$);
	}
}
