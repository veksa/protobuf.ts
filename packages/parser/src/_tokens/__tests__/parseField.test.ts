import {Thrower} from '../../_helpers/thrower';
import {parseField} from '../parseField';

describe('parseField', () => {
    test('Field empty', () => {
        try {
            parseField([]);
        } catch (e) {
            expect(e).toEqual(new Thrower('field', [['No ; found for message field', 0]]));
        }
    });

    test('Field empty name', () => {
        try {
            parseField(['=', '123', ';']);
        } catch (e) {
            expect(e).toEqual(new Thrower('field', [['Missing field name', 0]]));
        }
    });

    test('Field empty tag', () => {
        try {
            parseField(['required', 'type', 'name', '=', '', ';']);
        } catch (e) {
            expect(e).toEqual(new Thrower('field', [['Missing tag number in message field: name', 0]]));
        }
    });

    test('Field empty type', () => {
        try {
            parseField(['required', '', 'name', '=', '1', ';']);
        } catch (e) {
            expect(e).toEqual(new Thrower('field', [['Missing type in message field: name', 0]]));
        }
    });

    test('Field empty undefined', () => {
        try {
            parseField(['required', 'type', 'name', '//', 'comment']);
        } catch (e) {
            expect(e).toEqual(new Thrower('field', [['No ; found for message field', 0]]));
        }
    });
});
