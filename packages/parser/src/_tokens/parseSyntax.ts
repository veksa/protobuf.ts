import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check, cut, cutStr} from '../_helpers/utils';
import {isProto} from '../_helpers/validators';

export function parseSyntax(tokenList: IToken[]) {
    const {range, len} = check({
        type: 'syntax',
        tokenList,
        rules: [ch('syntax'), ch('='), ch(isProto), ch(';')],
    });

    cut(tokenList, len);

    return cutStr(range[2].text) === 'proto2'
        ? 2
        : 3;
}
