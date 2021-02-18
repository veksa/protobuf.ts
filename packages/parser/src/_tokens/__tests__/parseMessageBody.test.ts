import {Thrower} from '../../_helpers/thrower';
import {parseMessageBody} from '../parseMessageBody';

describe('parseMessageBody', () => {
    test('Message empty', () => {
        try {
            parseMessageBody([';', '//', 'comment'], 'name');
        } catch (e) {
            expect(e).toEqual(new Thrower('message', [['no close tag "}"', 0]]));
        }
    });
});
