/// <reference path="src/neat-studio.ts" />

namespace Neat {
	console.log(Neat);
	(async () => {
		let session = Core.Session.current;
		let osc = new Core.Audio.Oscillator(session);
		osc.exports[0].Connect(session.destination.imports[0]);
		osc.node.start(0);
		await new Promise(r => setTimeout(r, 100));
		osc.node.stop(0);
	})();
}
