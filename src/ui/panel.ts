import Control from './control';
import './panel.scss';
import Tensor from '@util/tensor';
import { MouseDragEvent } from '@util/mousedrag';
import Session from '@neat/session';

export default class Panel extends Control {
	readonly $header: HTMLElement;
	readonly $name: HTMLElement;
	readonly $resizer: HTMLElement;

	set outerSize(value: Tensor) {
		this.$outer.style.width = `${value.Components[0]}px`;
		this.$outer.style.height = `${value.Components[1]}px`;
	}
	get outerSize(): Tensor {
		return super.outerSize;
	}
	set position(value: Tensor) {
		this.$outer.style.left = `${value.Components[0]}px`;
		this.$outer.style.top = `${value.Components[1]}px`;
	}
	get position(): Tensor {
		return super.position;
	}

	get name(): string {
		return this.$name.innerText;
	}
	set name(value: string) {
		this.$name.innerText = value;
	}

	constructor(name: string) {
		super(document.createElement('section'), document.createElement('main'));

		this.$outer.classList.add('panel');

		this.$header = document.createElement('header');
		this.Add(this.$header, true, true);

		this.$name = document.createElement('p');
		this.$name.classList.add('name');
		this.$header.append(this.$name);
		this.$header.addEventListener('mousedragstart', (event: MouseDragEvent) => {
			const startPosition = this.position;
			const OnDrag = (event: MouseDragEvent) => {
				this.position = startPosition.Plus(event.offset);
			};
			this.$header.addEventListener('mousedragmove', OnDrag);
			this.$header.addEventListener('mousedragend',
				() => this.$header.removeEventListener('mousedragmove', OnDrag),
				{ once: true }
			);
		});

		this.name = name;

		this.$resizer = document.createElement('div');
		this.$resizer.classList.add('resizer');
		this.Add(this.$resizer, false, true);
		this.$resizer.addEventListener('mousedragmove', (event: MouseEvent) => {
			this.outerSize = new Tensor([event.pageX, event.pageY]).Minus(this.position);
			this.dispatchEvent(new Event('resize'));
		});

		Session.current!.panelManager.Register(this);
	}

	Destroy() {
		Session.current!.panelManager.Unregister(this);
		super.Destroy();
	}
}
