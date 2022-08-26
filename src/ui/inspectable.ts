import Control from "./control";

/** @summary All inspectable elements */
interface Element {
	get control(): Control;
}

interface Property extends Element {}

export default interface InspectableControl extends Control {
	get elements(): Iterable<Element>;
}
