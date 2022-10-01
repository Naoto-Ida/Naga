// Import chalk from 'chalk';

abstract class Debuggable {
	abstract _isDebug: boolean;

	msg(value: string, lvl: 'debug' | 'info' = 'debug') {
		if (this._isDebug) {
			switch (lvl) {
				case 'debug':
					if (window) {
						console.log(value);
					} else {
						// Console.log(chalk.white(value));
					}

					break;
				case 'info':
					if (window) {
						console.info(value);
					} else {
						// Console.info(chalk.blue(value));
					}

					break;
				default:
					break;
			}
		}
	}
}

export default Debuggable;
