import 'normalize.css';
import './stylesheet/neat-studio.scss';

import Control from './ui/control';
import Panel from './ui/panel';

const root: Control = new Control(document.body);

const $header = document.createElement('header');
const header: Control = new Control($header, $header, root);

const $workspace = document.createElement('main');
const workspace: Control = new Control($workspace, $workspace, root);

export {
	root, header, workspace,
	Control,
	Panel
}
