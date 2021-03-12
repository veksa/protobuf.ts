import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check} from '../_helpers/utils';
import {isNumber} from '../_helpers/validators';

export function parseExtensions(tokenList: IToken[]) {
    const {results, len} = check({
        type: 'extensions',
        tokenList,
        rules: [
            ch('extensions'),
            ch(isNumber, {result: true}),
            ch('to'),
            ch(['max', isNumber], {result: true}),
            ch(';'),
        ],
    });

    tokenList.splice(0, len);

    return {
        from: Number(results[0]),
        to: results[1] === 'max' ? 0x1fffffff : Number(results[1]),
    };
}
