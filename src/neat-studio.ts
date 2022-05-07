import * as Core from './core';

Core.Session.current = new Core.Session();

declare global {
	interface Window { Neat: any; }
}

export default window.Neat = { Core };
