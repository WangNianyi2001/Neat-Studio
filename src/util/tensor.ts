function ArrayEqual<T>(a: T[], b: T[]): boolean {
	if(a.length !== b.length)
		return false;
	for(let i = 0; i < a.length; ++i) {
		if(a[i] !== b[i])
			return false;
	}
	return true;
}

export default class Tensor {
	readonly content!: Tensor[] | number;

	get IsScalar(): boolean {
		return typeof this.content === 'number';
	}
	get Scalar(): number {
		return this.content as number;
	}
	get Components(): Tensor[] {
		return this.content as Tensor[];
	}
	get Dimension(): number {
		return this.IsScalar ? 0 : this.Components.length;
	}
	get First(): number {
		if(this.IsScalar)
			return this.Scalar;
		return this.Components[0].First;
	}

	get Dimensions(): number[] {
		if(this.IsScalar)
			return [];
		const result: number[] = [];
		for(let curr: Tensor = this; curr.Dimension > 0; ) {
			result.push(curr.Dimension);
			curr = curr.Components[0];
		}
		return result;
	}

	constructor(content: Iterable<Tensor | number> | Tensor | number) {
		if(typeof content === 'number')
			this.content = content;
		else if(content instanceof Tensor)
			return content;
		else
			this.content = [...content].map(component => new Tensor(component));
	}

	toString(): string {
		if(this.IsScalar)
			return this.Scalar.toString();
		else return `[${this.Components
			.map(component => component.toString())
			.join(',')
		}]`;
	}
	valueOf(): number | string {
		return this.content ? this.toString() : this.Scalar;
	}
	ToArray(): number | Array<any> {
		return this.IsScalar ? this.Scalar
			: this.Components.map(component => component.ToArray());
	}
	ToSVG(): string {
		return (this.ToArray() as Array<number>).join(' ');
	}

	Copy(): Tensor {
		return new Tensor(this.content);
	}

	Equal(tensor: Tensor): boolean {
		if(this.IsScalar)
			return this.Scalar === tensor.Scalar;
		return this.Components
			.every((c, i) => c.Equal(this.Components[i]));
	}

	static Map(x: Tensor, predicate: (x: number) => number): Tensor {
		if(x.IsScalar)
			return new Tensor(predicate(x.Scalar));
		return new Tensor(x.Components
			.map(component => Tensor.Map(component, predicate))
		);
	}
	Map(predicate: (x: number) => number): Tensor {
		return Tensor.Map(this, predicate);
	}

	static Combine(
		a: Tensor, b: Tensor,
		predicate: (a: number, b: number) => number
	): Tensor {
		if(a.Dimension !== b.Dimension)
			throw new TypeError('Only tensors with same dimensions can be combined!');
		if(a.IsScalar)
			return new Tensor(predicate(a.Scalar, b.Scalar));
		const components = Array(a.Dimension);
		for(let i = 0; i < a.Dimension; ++i)
			components[i] = Tensor.Combine(a.Components[i], b.Components[i], predicate);
		return new Tensor(components);
	}
	Combine(tensor: Tensor, predicate: (a: number, b: number) => number) {
		return Tensor.Combine(this, tensor, predicate);
	}

	Plus(tensor: Tensor): Tensor {
		return this.Combine(tensor, (a, b) => a + b);
	}
	Minus(tensor: Tensor): Tensor {
		return this.Combine(tensor, (a, b) => a - b);
	}
	Scale(scalar: number | Tensor): Tensor {
		if(scalar instanceof Tensor)
			return this.Combine(scalar, (a, b) => a * b);
		return this.Map(x => x * scalar);
	}
	Modulo(divisor: number | Tensor): Tensor {
		if(divisor instanceof Tensor)
			return this.Combine(divisor, (a, b) => a % b);
		return this.Map(x => x * divisor);
	}
}
