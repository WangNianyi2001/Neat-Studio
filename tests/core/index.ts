import Neat from '@neat/neat-studio';

(async () => {
	const session = Neat.Core.Session.current;
	const sessionIm = session.destination.GetPortsOfType(Neat.Core.Audio.Import)[0];
	const osc = new Neat.Core.Audio.Oscillator(session.context);
	const oscEx = osc.GetPortsOfType(Neat.Core.Audio.Export)[0];
	oscEx.Connect(sessionIm);
	osc.Start();
	osc.Stop(.5);
	setTimeout(() => {
		oscEx.Disconnect(sessionIm);
	}, 1000);
})();
