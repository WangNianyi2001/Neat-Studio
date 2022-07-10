export type Type<T> = new (...args: any[]) => T;

const fileChooser: HTMLInputElement = document.createElement('input');
fileChooser.type = 'file';

export async function ChooseFile(): Promise<File[]> {
	fileChooser.click();
	return await new Promise(res => {
		let files: File[] = [];
		let input: boolean = false;
		const onInput = () => {
			input = true;
			if(fileChooser.files !== null)
				files.push(...fileChooser.files);
		};
		const onFocus = () => {
			setTimeout(() => {
				if(!input)
					fileChooser.removeEventListener('input', onInput);
				res(files);
			}, 500);
		};
		fileChooser.addEventListener('input', onInput, { once: true });
		window.addEventListener('focus', onFocus, { once: true });
		window.blur();
	});
}

export const arrEq = (a: Array<any>, b: Array<any>) =>
	a.reduce((old, v, i) => old && b[i] === v, true);

