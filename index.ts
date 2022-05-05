import Neat from './src/neat-studio';
import Oscillator from "./src/core/station/oscillator";

(async () => {
	let session = Neat.Session.current;
	let osc = new Oscillator(session);
	osc.plugs[0].Connect(session.destination.sockets[0]);
	osc.node.start(0);
	await new Promise(r => setTimeout(r, 100));
	osc.node.stop(0);
})();
