import {cutStr} from '../utils';

describe('cutStr', () => {
    test('should return empty string on undefined', () => {
        expect(cutStr()).toEqual('');
    });
});
