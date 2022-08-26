import Control from '../control';
import Panel from '../panel';
import { SVG, Svg, Path as SVGPathElement } from '@svgdotjs/svg.js';
import './graph-editor.scss';
import Station from '@core/station';
import Graph from '@core/graph';
import Tensor from '@util/tensor';
import { MouseDragEvent } from '@neat/util/mousedrag';
import { Entry } from '../context-menu';
import { RelativePosition } from '@util/coordinate';
import '@util/html-element';

class RouteControl {
	readonly route: Station.Route;
	readonly fromCtrl: PortControl;
	readonly toCtrl: PortControl;
	readonly $: SVGPathElement;

	constructor(route: Station.Route, fromCtrl: PortControl, toCtrl: PortControl) {
		this.route = route;
		this.fromCtrl = fromCtrl;
		this.toCtrl = toCtrl;
		this.$ = fromCtrl.stationCtrl.editor.svg.path();
		this.fromCtrl.$outer.classList.add('connected');
		this.toCtrl.$outer.classList.add('connected');

		const onUpdate = this.OnUpdate.bind(this);
		this.fromCtrl.stationCtrl.addEventListener('move', onUpdate as EventListener);
		this.toCtrl.stationCtrl.addEventListener('move', onUpdate as EventListener);
		this.OnUpdate();
	}

	OnUpdate() {
		const editor = this.fromCtrl.stationCtrl.editor;
		const fromPos = RelativePosition(this.fromCtrl.$knob, editor.$inner);
		const toPos = RelativePosition(this.toCtrl.$knob, editor.$inner);
		const xDelta = (toPos.First - fromPos.First) / 2;
		this.$.plot(`
			M ${fromPos.ToSVG()}
			C ${fromPos.Plus(new Tensor([xDelta, 0])).ToSVG()}
			  ${toPos.Plus(new Tensor([-xDelta, 0])).ToSVG()}
			  ${toPos.ToSVG()}
		`);
		this.$.stroke({
			color: 'white',
			width: 1
		});
	}
}

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
		this.$outer.classList.add('port');

		this.port = port;
		this.stationCtrl = stationCtrl;
		this.stationCtrl.Add(
			this, false,
			this.port.type === Station.PortType.Export
				? this.stationCtrl.$exportSlot
				: this.stationCtrl.$importSlot
		);

		this.$knob = document.createElement('div');
		this.$knob.classList.add('knob');

		this.$name = document.createElement('span');
		this.$name.classList.add('name');
		this.name = this.name;

		this.$outer.append(this.$knob, this.$name);

		this.$outer.addEventListener('mousedragend', (ev: MouseDragEvent) => {
			const targetPortEl = ev.$drop?.FindInParent($ => $.control instanceof PortControl);
			if(targetPortEl === null)
				return;
			const targetPortCtrl = targetPortEl?.control as PortControl;
			if(this.port.ConnectedTo(targetPortCtrl.port))
				return;
			this.ConnectTo(targetPortCtrl);
		});
	}

	ConnectTo(peer: PortControl) {
		const route = this.port.ConnectTo(peer.port);
		if(route === null)
			return;
		new RouteControl(route, this, peer);	// Need to exchange
	}
}

export class StationControl extends Control {
	readonly editor: GraphEditor;
	readonly station: Station;
	$header: HTMLElement;
	$importSlot: HTMLElement;
	$belly: HTMLElement;
	$exportSlot: HTMLElement;

	set name(name: string) {
		this.$header.innerText = name;
	}

	constructor(editor: GraphEditor, station: Station) {
		super(document.createElement('div'), document.createElement('main'));
		this.editor = editor;
		this.station = station;
		this.$outer.classList.add('station');

		this.$header = document.createElement('header');
		this.$outer.append(this.$header, this.$inner);
		this.name = station.constructor.name;

		this.$header.addEventListener('mousedragstart', () => {
			const start: Tensor = this.position;
			const OnMove = ({ offset }: MouseDragEvent) => 
				this.MoveTo(start.Plus(offset.Scale(1 / this.editor.scale)));
			this.$header.addEventListener('mousedragmove', OnMove);
			this.$header.addEventListener('mousedragend', function(this: HTMLElement) {
				this.removeEventListener('mousedragmove', OnMove);
			});
		});

		this.$importSlot = document.createElement('div');
		this.$importSlot.classList.add('slot', 'import');

		this.$belly = document.createElement('div');
		this.$belly.classList.add('belly');

		this.$exportSlot = document.createElement('div');
		this.$exportSlot.classList.add('slot', 'export');

		this.$inner.append(this.$importSlot, this.$belly, this.$exportSlot);

		for(const port of [this.station.exports, this.station.imports].flat())
			new PortControl(port, this);
	}

	MoveTo(position: Tensor) {
		this.$outer.style.left = `${position.Components[0]}px`;
		this.$outer.style.top = `${position.Components[1]}px`;
		const moveEv = new Event('move');
		requestAnimationFrame(this.dispatchEvent.bind(this, moveEv));
	}
}

export default class GraphEditor extends Panel {
	readonly graph: Graph;
	readonly $viewport: HTMLElement;
	readonly svg: Svg;
	
	#scale: number = 1;

	set scale(value: number) {
		this.#scale = value;
		this.$viewport.style.transform = `scale(${this.#scale})`;
	}
	get scale(): number {
		return this.#scale;
	}

	constructor(graph: Graph) {
		super("Graph Editor");
		this.graph = graph;

		this.$outer.classList.add('graph-editor');

		this.$viewport = document.createElement('div');
		this.Add(this.$viewport);
		this.$viewport.classList.add('viewport');
		this.$viewport.addEventListener('wheel', (ev: WheelEvent) => {
			ev.stopPropagation();
			ev.preventDefault();
			this.scale *= Math.exp(-ev.deltaY / 1000);
			return false;
		});

		this.contextMenu = new Entry(
			'', null, [
				new Entry(
					'Create New Station', null,
					[...Station.types].map(
						([ name, type ]) => new Entry(
							name, null,
							this.CreateStation.bind(this, type)
						)
					)
				)
			]
		);

		this.svg = SVG();
		this.svg.addTo(this.$viewport);
		this.addEventListener('resize', function(this: GraphEditor) {
			this.svg.size(...this.innerSize.ToArray() as Array<number>);
		});

		for(const station of this.graph.stations)
			this.AddStation(station);
	}

	CreateStation(type: Station.Constructor) {
		const station: Station = new type();
		this.AddStation(station);
	}

	AddStation(station: Station): StationControl {
		const control = new StationControl(this, station);
		this.Add(control, false, this.$viewport);
		return control;
	}
}
