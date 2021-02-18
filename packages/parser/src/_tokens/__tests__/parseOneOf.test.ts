import {parseOneOf} from '../oneof';
import {Thrower} from '../../_helpers/thrower';

describe('parseOneOf', () => {
    test('Oneof empty', () => {
        try {
            parseOneOf(['oneof', 'name', '{', '//', 'comment']);
        } catch (e) {
            expect(e).toEqual(new Thrower('oneof', [['no close tag "}"', 0]]));
        }
    });
});
