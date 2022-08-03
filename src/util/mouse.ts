import Tensor from "./tensor";

let position = new Tensor([0, 0]);

export default {
	get position(): Tensor {
		return position.Copy();
	}
};

document.body.addEventListener(
	'mousemove',
	(ev: MouseEvent) => position = new Tensor([ev.pageX, ev.pageY])
);
