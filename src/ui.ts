import 'normalize.css';
import './ui.scss';

import Control from './ui/control';

const root: Control = new Control(document.body);

const header: Control = new Control(document.createElement('header'));
header.AttachTo(root);

const workspace: Control = new Control(document.createElement('main'));
workspace.AttachTo(root);

import Panel from './ui/panel';
import GraphEditor from './ui/panels/graph-editor';

export {
	root, header as header, workspace,
	Control,
	Panel,
	GraphEditor
}
