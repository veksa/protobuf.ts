import {ch, check, cut} from '../_helpers/utils';
import {isNumber} from '../_helpers/validators';

export function parseExtensions(tokens: string[]) {
    const {results, len} = check({
        type: 'extensions',
        tokens,
        rules: [
            ch('extensions'),
            ch(isNumber, {result: true}),
            ch('to'),
            ch(['max', isNumber], {result: true}),
            ch(';'),
        ],
    });

    cut(tokens, len);

    return {
        from: Number(results[0]),
        to: results[1] === 'max' ? 0x1fffffff : Number(results[1])
    };
}
