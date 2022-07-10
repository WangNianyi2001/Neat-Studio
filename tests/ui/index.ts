import Neat from '@neat/neat-studio';

const graphEditor = new Neat.UI.GraphEditor(Neat.Core.Session.current!.graph);
graphEditor.AttachTo(Neat.UI.workspace);
