import Control from '../control';
import Panel from '../panel';
import * as SVG from '@svgdotjs/svg.js';
import './graph-editor.scss';

export default class GraphEditor extends Panel {
	readonly viewport: Control;
	readonly graph: SVG.Svg;

	constructor() {
		super("Graph Editor");
		this.element.classList.add('graph-editor');
		this.viewport = new Control(document.createElement('div'));
		this.viewport.element.classList.add('viewport');
		this.content.Attach(this.viewport);
		this.graph = SVG.SVG();
		this.graph.addTo(this.viewport.element as HTMLElement);
		this.addEventListener('resize', () => this.graph.size(...this.content.size));
	}
}
