import Neat from './src/neat-studio';
import Oscillator from "./src/core/station/oscillator";

let session = Neat.Session.current;
let osc = new Oscillator(session);
osc.plugs[0].Connect(session.destination.sockets[0]);
osc.outNode.start(0);
(async () => {
	await new Promise(r => setTimeout(r, 100));
	osc.outNode.stop(0);
})();
