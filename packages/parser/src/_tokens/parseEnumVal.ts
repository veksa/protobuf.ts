import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check} from '../_helpers/utils';
import {isNumber, isText} from '../_helpers/validators';
import {parseInnerOptions} from './parseInnerOptions';

export function parseEnumVal(tokenList: IToken[]) {
    const parenthesisToken = tokenList.find(token => {
        return token.text === '}';
    });

    const {results} = check({
        type: 'enum value',
        tokenList: [tokenList[0], tokenList[1], tokenList[2], tokenList[3], parenthesisToken],
        rules: [ch(isText, {result: true}), ch('='), ch(isNumber, {result: true}), ch([';', '[']), ch([';'])],
    });

    tokenList.splice(0, 3);

    const options = tokenList[0].text === '[' ? parseInnerOptions(tokenList) : {};

    tokenList.splice(0, 1);

    return {
        name: results[0],
        value: {
            value: Number(results[1]),
            options,
        },
    };
}
