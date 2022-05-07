import Neat from '../src/neat-studio';

(async () => {
	const session = Neat.Core.Session.current;
	const sessionIm = session.destination.GetPortsOfType(Neat.Core.Audio.Import)[0];
	const osc = new Neat.Core.Audio.Oscillator(session.context);
	const oscEx = osc.GetPortsOfType(Neat.Core.Audio.Export)[0];
	oscEx.Connect(sessionIm);
	osc.Start();
	setTimeout(() => {
		oscEx.Disconnect(sessionIm);
	}, 100);
	setTimeout(() => {
		osc.Stop();
	}, 1000);
})();
