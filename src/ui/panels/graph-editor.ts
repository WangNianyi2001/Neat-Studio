import Control from '../control';
import Panel from '../panel';
import * as SVG from '@svgdotjs/svg.js';
import './graph-editor.scss';
import Station from '@core/station';
import Graph from '@core/graph';
import Tensor from '@tensor';

export class StationControl extends Control {
	readonly station: Station;
	graphPos: Tensor = new Tensor([0, 0]);

	constructor(station: Station) {
		super(document.createElement('div'));
		this.station = station;
		this.element.classList.add('station');
	}
}

export default class GraphEditor extends Panel {
	readonly graph: Graph;
	readonly viewport: Control;
	readonly svg: SVG.Svg;

	constructor(graph: Graph) {
		super("Graph Editor");
		this.graph = graph;

		this.element.classList.add('graph-editor');

		this.viewport = new Control(document.createElement('div'));
		this.viewport.element.classList.add('viewport');
		this.content.Attach(this.viewport);

		this.svg = SVG.SVG();
		this.svg.addTo(this.viewport.element as HTMLElement);

		for(const station of this.graph.stations)
			this.#AddStation(station);
	}

	#AddStation(station: Station): StationControl {
		const control = new StationControl(station);
		control.AttachTo(this.viewport);
		return control;
	}
}
