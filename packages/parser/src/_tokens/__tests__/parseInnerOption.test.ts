import {Thrower} from '../../_helpers/thrower';
import {parseInnerOptions} from '../parseInnerOptions';

describe('parseInnerOptions', () => {
    test('Options inner', () => {
        try {
            parseInnerOptions(['//', 'comment']);
        } catch (e) {
            expect(e).toEqual(new Thrower('inner options', [['no close tag "]"', 0]]));
        }
    });
});
