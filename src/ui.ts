import 'normalize.css';
import './stylesheet/index.scss';

import Control from './ui/control';
import Panel from './ui/panel';

const root: Control = new Control(document.body);

const header: Control = new Control(document.createElement('header'));
header.AttachTo(root);

const workspace: Control = new Control(document.createElement('main'));
workspace.AttachTo(root);

export {
	root, header as header, workspace,
	Control,
	Panel
}
