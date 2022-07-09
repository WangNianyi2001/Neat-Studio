import Neat from '@neat/neat-studio';

const panel = new Neat.UI.Panel('Test Panel');
panel.AttachTo(Neat.UI.workspace);

setTimeout(() => panel.Destroy(), 1000);
