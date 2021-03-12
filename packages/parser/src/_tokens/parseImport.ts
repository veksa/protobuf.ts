import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check, cutStr} from '../_helpers/utils';
import {isStr} from '../_helpers/validators';

export function parseImport(tokenList: IToken[]) {
    const {len, results} = check({
        type: 'import',
        tokenList,
        rules: [ch('import'), ch(isStr, {result: true}), ch(';')],
    });

    tokenList.splice(0, len);

    return cutStr(results[0]);
}
