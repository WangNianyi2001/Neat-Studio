declare global {
	export interface HTMLElement {
		addEventListener(event: string, listener: Function, option?: any): void;
	}
}

export default document.body.addEventListener('mousedown', (ev: MouseEvent) => {
	const target = ev.target;
	if(!target)
		return;
	target.dispatchEvent(new MouseEvent('mousedragstart', ev));
	const onMouseMove = (ev: MouseEvent) => target.dispatchEvent(new MouseEvent('mousedragmove', ev));
	document.body.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup',
		(ev: MouseEvent) => {
			document.body.removeEventListener('mousemove', onMouseMove);
			target.dispatchEvent(new MouseEvent('mousedragend', ev));
		},
		{ once: true }
	);
});
