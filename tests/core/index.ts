import Neat from '@neat/neat-studio';
import { ChooseFile } from '@neat/utility';

const sampler = new Neat.Core.Audio.Sampler();
const session = Neat.Core.Session.current;
sampler.GetPortsOfType(Neat.Core.Audio.Export)[0].Connect(
	session.destination.GetPortsOfType(Neat.Core.Audio.Import)[0]
);

const playChosenFile = async () => {
	const files = await ChooseFile();
	if(files.length < 1)
		return;
	const file = files[0];
	const sample = await Neat.Core.Audio.LoadFromFile(file);
	sampler.SetSample(sample);
	sampler.Start();
};

window.onclick = playChosenFile;
