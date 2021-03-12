import {IToken} from '@protobuf.ts/tokenizer';
import {parseMessage} from './parseMessage';

export function parseExtend(tokenList: IToken[]) {
    return {
        name: tokenList[1].text,
        message: parseMessage(tokenList),
    };
}
