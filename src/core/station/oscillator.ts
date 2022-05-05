import Session from '../../session';
import { Source, Plug } from './station';

class Oscillator extends Source {
	node: OscillatorNode;
	readonly plugs: Plug[];
	length = Infinity;

	constructor(session: Session) {
		super();
		this.node = new OscillatorNode(session.context);
		this.plugs = [new Plug(this.node)];
	}
}

export default Oscillator;
