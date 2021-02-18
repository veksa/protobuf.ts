import {Thrower} from '../../_helpers/thrower';
import {parseOptionValue} from '../parseOptionValue';

describe('parseOptionValue', () => {
    test('Options value', () => {
        try {
            parseOptionValue(['{', '//', 'comment']);
        } catch (e) {
            expect(e).toEqual(new Thrower('option array', [['no close tag "}"', 0]]));
        }
    });
});
