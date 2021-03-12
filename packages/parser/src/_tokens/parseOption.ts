import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseOptionValue} from './parseOptionValue';

export function parseOption(tokenList: IToken[]) {
    const {len, results} = check({
        type: 'option',
        tokenList,
        rules: [
            ch('(', {ignore: true}),
            ch(isText, {result: true}),
            ch(')', {ignore: true}),
            ch(isText, {result: true, ignore: true}),
            ch('='),
            ch([isText, '{']),
        ],
    });

    cut(tokenList, len - 1);

    const field = results[0] + results[1];
    const value = parseOptionValue(tokenList);

    return {
        field,
        value,
    };
}
