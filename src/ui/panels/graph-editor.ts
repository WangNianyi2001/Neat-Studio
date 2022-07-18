import Control from '../control';
import Panel from '../panel';
import * as SVG from '@svgdotjs/svg.js';
import './graph-editor.scss';
import Station from '@core/station';
import Graph from '@core/graph';
import Tensor from '@util/tensor';

export class PortControl extends Control {
	readonly port: Station.Port;
	readonly stationCtrl: StationControl;
	readonly $knob: HTMLElement;
	readonly $name: HTMLElement;

	get name(): string {
		return this.port.name;
	}
	set name(name: string) {
		this.port.name = name;
		this.$name.innerText = name;
	}

	constructor(port: Station.Port, stationCtrl: StationControl) {
		super(document.createElement('div'));
		this.element.classList.add('port');

		this.port = port;
		this.stationCtrl = stationCtrl;
		this.AttachTo(this.stationCtrl,
			this.port.type == Station.PortType.Import
				? this.stationCtrl.$importSlot
				: this.stationCtrl.$exportSlot
		);

		this.$knob = document.createElement('div');
		this.$knob.classList.add('knob');

		this.$name = document.createElement('span');
		this.$name.classList.add('name');
		this.name = this.name;

		this.element.append(this.$knob, this.$name);
	}
}

export class StationControl extends Control {
	readonly station: Station;
	graphPos: Tensor = new Tensor([0, 0]);
	$header: HTMLElement;
	$main: HTMLElement;
	$importSlot: HTMLElement;
	$belly: HTMLElement;
	$exportSlot: HTMLElement;

	set name(name: string) {
		this.$header.innerText = name;
	}

	constructor(station: Station) {
		super(document.createElement('div'));
		this.station = station;
		this.element.classList.add('station');

		this.$header = document.createElement('header');
		this.$main = document.createElement('main');
		this.element.append(this.$header, this.$main);
		this.name = station.constructor.name;

		this.$importSlot = document.createElement('div');
		this.$importSlot.classList.add('slot', 'import');

		this.$belly = document.createElement('div');
		this.$belly.classList.add('belly');

		this.$exportSlot = document.createElement('div');
		this.$exportSlot.classList.add('slot', 'export');

		this.$main.append(this.$importSlot, this.$belly, this.$exportSlot);

		for(const port of [this.station.exports, this.station.imports].flat())
			new PortControl(port, this);
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
		this.viewport.AttachTo(this.content);

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
