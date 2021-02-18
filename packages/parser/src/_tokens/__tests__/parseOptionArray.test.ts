import {Thrower} from '../../_helpers/thrower';
import {parseOptionArray} from '../parseOptionArray';

describe('parseOptionArray', () => {
    test('Options array', () => {
        try {
            parseOptionArray(['//', 'comment']);
        } catch (e) {
            expect(e).toEqual(new Thrower('options array', [['no close tag "]"', 0]]));
        }
    });

    test('Options array token', () => {
        try {
            parseOptionArray(['comment']);
        } catch (e) {
            expect(e).toEqual(new Thrower('options array', [['Unexpected token "comment"', 0]]));
        }
    });
});
