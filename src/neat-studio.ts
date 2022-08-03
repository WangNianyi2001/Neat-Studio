import * as Core from './core';
import * as UI from './ui';

Core.Session.current = new Core.Session();

declare global {
	interface Window { Neat: any; }
}

export default window.Neat = { Core, UI };
