export default class Tensor implements Iterable<Tensor | number> {
	readonly scalor: number = 0;
	readonly components!: Tensor[] | null;

	get dimensions(): number[] {
		if(!this.components)
			return [];
		const result: number[] = [];
		for(let curr: Tensor = this;
			curr.components instanceof Array; ) {
			result.push(curr.components.length);
			if(curr.components.length === 0)
				break;
			const next = curr.components[0];
			if(!(next instanceof Tensor))
				break;
			curr = next;
		}
		return result;
	}

	constructor(components: Iterable<any> | number) {
		if(typeof components === 'number')
			this.scalor = components;
		else if(components instanceof Tensor)
			return components.Copy();
		else {
			this.components = [...components].map(
				component => new Tensor(component)
			);
		}
	}

	*[Symbol.iterator](): Iterator<Tensor | number> {
		if(!this.components)
			yield this.scalor;
		else {
			for(const component of this.components)
				yield component;
		}
	}

	toString(): string {
		if(!this.components)
			return this.scalor.toString();
		else
			return `[${this.components
				.map(component => component.toString())
				.join(',')
			}]`;
	}
	valueOf(): number | string {
		return this.components ? this.toString() : this.scalor;
	}
	ToArray(): number | Array<any> {
		return !this.components ? this.scalor
			: this.components.map(
				component => component.ToArray()
			);
	}
	ToSVG(): string {
		return (this.ToArray() as Array<number>).join(' ');
	}

	Copy(): Tensor {
		return new Tensor(this.components || this.scalor);
	}

	Equal(tensor: Tensor): boolean {
		if(!this.components)
			return this.scalor === tensor.scalor;
		return this.components.every((c, i) => c.Equal(tensor.components![i]));
	}

	Plus(tensor: Tensor): Tensor {
		if(!this.components)
			return new Tensor(this.scalor + tensor.scalor);
		return new Tensor(this.components.map(
			(c, i) => c.Plus(tensor.components![i])
		));
	}
	Minus(tensor: Tensor): Tensor {
		if(!this.components)
			return new Tensor(this.scalor - tensor.scalor);
		return new Tensor(this.components.map(
			(c, i) => c.Minus(tensor.components![i])
		));
	}
	Scale(scalor: number): Tensor {
		if(!this.components)
			return new Tensor(this.scalor * scalor);
		return new Tensor(this.components.map(c => c.Scale(scalor)));
	}
}
