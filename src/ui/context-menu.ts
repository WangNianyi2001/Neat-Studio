import './context-menu.scss';
import Tensor from "@neat/util/tensor";
import Control from "./control";
import Mouse from '@util/mouse';
import * as UI from '@neat/ui';
import '@util/html-element'

export class Entry {
	name: string;
	icon: typeof Image | null = null;
	content: Entry[] | Function | null = null;
	panel: EntryPanel | null = null;

	constructor(name: string = '', icon: typeof Image | null = null, content: Entry[] | Function = []) {
		this.name = name;
		if(icon)
			this.icon = icon;
		if(content) {
			if(content instanceof Function)
				this.content = content;
			else
				this.content = content.slice();
		}
	}

	FindEntry(path: string[]): Entry | null {
		if(!(this.content instanceof Array))
			return null;
		if(path.length === 0)
			return this;
		const first = path.shift()!;
		for(const subEntry of this.content) {
			if(subEntry.name === first)
				return subEntry.FindEntry(path);
		}
		return null;
	}
	AddSubEntry(path: string[] | string, icon: typeof Image | null = null, content: Entry[] | Function = []): Entry | null {
		if(!(this.content instanceof Array))
			return null;
		if(typeof path === 'string')
			path = [path];
		if(path.length === 0)
			return null;
		const first = path.shift()!;
		let subEntry: Entry;
		if(path.length === 0) {
			subEntry = new Entry(first, icon, content);
		} else {
			subEntry = new Entry(first);
			subEntry.AddSubEntry(path, icon, content);
		}
		this.content.push(subEntry);
		return subEntry;
	}

	Show(root: EntryItem | null = null) {
		if(!(this.content instanceof Array))
			return;
		if(root === null)
			HideCurrent();
		this.panel = new EntryPanel(this);
		this.panel.Show(root);
	}
	Hide() {
		this.panel?.Hide();
	}
}

let currentPanel: EntryPanel | null = null;

export function HideCurrent() {
	currentPanel?.Hide();
}

document.body.addEventListener('click', function(ev: Event) {
	if((ev.target as HTMLElement).FindInParent?.(current => current.control instanceof EntryControl))
		return;
	HideCurrent();
});

class EntryControl extends Control {
	readonly entry: Entry;

	constructor($: HTMLElement, entry: Entry) {
		super($);
		this.entry = entry;
	}
}

class EntryPanel extends EntryControl {
	constructor(entry: Entry) {
		super(document.createElement('ul'), entry);
		if(currentPanel === null)
			currentPanel = this;
		this.$outer.classList.add('context-menu');
	}

	Show(root: EntryItem | null = null) {
		if(!(this.entry.content instanceof Array))
			return;

		const position = root === null ? Mouse.position : root.subPosition;
		this.$outer.style.left = `${position.Components[0]}px`;
		this.$outer.style.top = `${position.Components[1]}px`;
		this.$outer.innerHTML = '';

		for(const subEntry of this.entry.content)
			new EntryItem(this, subEntry);

		this.AttachTo(root || UI.root);
	}

	Hide() {
		this.$outer.parentNode?.removeChild(this.$outer);
		if(this === currentPanel)
			currentPanel = null;
	}
}

class EntryItem extends EntryControl {
	readonly panel: EntryPanel;

	get subPosition(): Tensor {
		return this.position.Plus(
			new Tensor([this.outerSize.First, 0])
		);
	}

	constructor(panel: EntryPanel, entry: Entry) {
		super(document.createElement('li'), entry);
		this.panel = panel;
		this.AttachTo(this.panel);
		this.$outer.innerText = entry.name;

		const content = this.entry.content;
		if(content === null)
			this.$outer.setAttribute('disabled', '');
		this.$outer.addEventListener('click', () => {
			if(content instanceof Function) {
				content();
				HideCurrent();
			}
			else if(content instanceof Array<Entry>)
				this.entry.Show(this);
		});
	}
}
