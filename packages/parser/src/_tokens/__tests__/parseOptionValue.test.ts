import {parseOptionValue} from '../options';
import {Thrower} from '../../_helpers/thrower';

describe('parseOptionValue', () => {
    test('Options value', () => {
        try {
            parseOptionValue(['{', '//', 'comment']);
        } catch (e) {
            expect(e).toEqual(new Thrower('option array', [['no close tag "}"', 0]]));
        }
    });
});
