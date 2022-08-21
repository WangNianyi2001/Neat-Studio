import 'normalize.css';
import './ui.scss';

import Control from './ui/control';

export const root: Control = new Control(document.body);

export * as Panel from './ui/panel-import';
