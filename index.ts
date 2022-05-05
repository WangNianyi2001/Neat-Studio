import * as Neat from './src/neat-studio';

(async () => {
	let session = Neat.Core.Session.current;
	let osc = new Neat.Core.Audio.Oscillator(session.context);
	osc.exports[0].Connect(session.destination.imports[0]);
	osc.node.start(0);
	await new Promise(r => setTimeout(r, 100));
	osc.node.stop(0);
})();
