import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseOptionValue} from './parseOptionValue';

export function parseOption(tokens: string[]) {
    const {len, results} = check({
        type: 'option',
        tokens,
        rules: [
            ch('(', {ignore: true}),
            ch(isText, {result: true}),
            ch(')', {ignore: true}),
            ch(isText, {result: true, ignore: true}),
            ch('='),
            ch([isText, '{']),
        ],
    });

    cut(tokens, len - 1);
    const field = results[0] + results[1];
    const value = parseOptionValue(tokens);

    return {
        field,
        value,
    };
}
