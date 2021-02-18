import {parseReserved} from '../parseReserved';
import {Thrower} from '../../_helpers/thrower';

describe('Reserved', () => {
    test('Reserved token', () => {
        try {
            parseReserved(['name']);
        } catch (e) {
            expect(e).toEqual(new Thrower('reserved', [['Unexpected token "name"', 0]]));
        }
    });

    test('Reserved token', () => {
        try {
            parseReserved(['reserved', '1', '//', 'comment']);
        } catch (e) {
            expect(e).toEqual(new Thrower('reserved', [['no close tag ";"', 0]]));
        }
    });
});
