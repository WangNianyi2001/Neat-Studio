import { Core, UI } from '@neat/neat-studio';

const Panel = UI.Panel;

new Panel.Inspector();
new Panel.Timeline();
const graph = new Core.Graph();
graph.Add(Core.Session.current?.destination!);
new Panel.GraphEditor(graph);
