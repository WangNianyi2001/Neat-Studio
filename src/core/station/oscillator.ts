import Session from '../../session';
import { Source, Plug } from './station';

class Oscillator extends Source {
	outNode: OscillatorNode;
	readonly plugs: Plug[];
	length = Infinity;

	constructor(session: Session) {
		super(session);
		this.outNode = new OscillatorNode(session.context);
		this.plugs = [new Plug(this, 2)];
	}
}

export default Oscillator;
