import {isStr} from '../validators';

describe('isStr', () => {
    test('should return false on undefined', () => {
        expect(isStr()).toEqual(false);
    });
});
