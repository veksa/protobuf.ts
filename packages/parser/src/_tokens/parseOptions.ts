import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check, cut, semicolon} from '../_helpers/utils';
import {parseOption} from './parseOption';

export function parseOptions(tokenList: IToken[]) {
    const {len} = check({
        type: 'option',
        tokenList,
        rules: [ch('option')],
    });

    cut(tokenList, len);

    const result = parseOption(tokenList);

    semicolon(tokenList);

    return result;
}
