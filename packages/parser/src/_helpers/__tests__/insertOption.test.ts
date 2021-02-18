import {Thrower} from '../thrower';
import {insertOption} from '../utils';

describe('insertOption', () => {
    test('insertOption name', () => {
        let er: unknown;
        try {
            insertOption({}, undefined, '');
        } catch (e) {
            er = e;
        }

        expect(er).toEqual(new Thrower('insert option', [['No any field name', 0]]));
    });
});
