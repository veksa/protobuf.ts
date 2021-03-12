import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';

export function parseMap(tokenList: IToken[]) {
    const {len, results} = check({
        type: 'map',
        tokenList,
        rules: [
            ch('map'),
            ch('<'),
            ch(isText, {result: true}),
            ch(','),
            ch(isText, {result: true}),
            ch('>'),
            ch(isText, {result: true}),
        ],
    });

    cut(tokenList, len);

    return {
        type: 'map',
        map: {
            from: results[0],
            to: results[1],
        },
        name: results[2],
    };
}
