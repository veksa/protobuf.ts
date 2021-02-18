import {Thrower} from '../../_helpers/thrower';
import {parseReservedItem} from '../reserved';

describe('parseReservedItem', () => {
    test('Reserved item', () => {
        try {
            parseReservedItem(['}']);
        } catch (e) {
            expect(e).toEqual(
                new Thrower('reserved', [
                    ['Token "}" not equal "number"', 0],
                    ['Token "" not equal "to"', 1],
                    ['Token "}" not equal "number,string"', 0],
                ]),
            );
        }
    });
});
