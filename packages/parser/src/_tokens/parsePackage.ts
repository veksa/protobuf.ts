import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';

export function parsePackage(tokenList: IToken[]) {
    const {len, results} = check({
        type: 'package',
        tokenList,
        rules: [ch('package'), ch(isText, {result: true}), ch(';')],
    });

    cut(tokenList, len);

    return results[0];
}
