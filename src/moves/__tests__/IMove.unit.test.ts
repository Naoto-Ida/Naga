import {describe, it, expect} from 'vitest';

import IMove from '../IMove';

describe('IMove', () => {
	class Foo extends IMove {
		constructor() {
			super({name: 'Foo'});
		}
	}

	it('returns name', () => {
		expect(new Foo().name).toBe('Foo');
	});
});
