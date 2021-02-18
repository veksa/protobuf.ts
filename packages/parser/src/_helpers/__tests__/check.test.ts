import {ch, check} from '../utils';
import {isStr} from '../validators';

describe('check', () => {
    test('check', () => {
        expect(
            check({
                rules: [ch(isStr)],
                tokens: ['abc'],
            }),
        ).toEqual({
            errors: [['Token "abc" not equal " string with quotes "..." or \'...\' "', 0]],
            len: 1,
            range: ['abc'],
            results: [],
        });
    });

    test('check', () => {
        expect(
            check({
                rules: [ch('none', {ignore: true}), ch('123', {strict: true, result: true})],
                // eslint-disable-next-line no-sparse-arrays
                tokens: [, '123'],
            }),
        ).toEqual({
            errors: [],
            len: 1,
            range: [undefined, '123'],
            results: ['123'],
        });
    });
});
