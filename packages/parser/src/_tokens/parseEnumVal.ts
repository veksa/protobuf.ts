import {ch, check, cut} from '../_helpers/utils';
import {isNumber, isText} from '../_helpers/validators';
import {parseInnerOptions} from './parseInnerOptions';

export function parseEnumVal(tokens: string[]) {
    const {results} = check({
        type: 'enum value',
        tokens: tokens.slice(0, 4).concat(tokens[tokens.indexOf(';')]),
        rules: [ch(isText, {result: true}), ch('='), ch(isNumber, {result: true}), ch([';', '[']), ch([';'])],
    });

    cut(tokens, 3);
    const options = tokens[0] === '[' ? parseInnerOptions(tokens) : {};
    cut(tokens, 1);

    return {
        name: results[0],
        value: {
            value: Number(results[1]),
            options,
        },
    };
}
