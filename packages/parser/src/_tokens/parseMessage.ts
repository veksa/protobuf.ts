import {IToken} from '@protobuf.ts/tokenizer';
import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseMessageBody} from './parseMessageBody';

export function parseMessage(tokenList: IToken[]) {
    const parenthesisToken = tokenList.find(token => {
        return token.text === '}';
    });

    const {len} = check({
        type: 'message',
        tokenList: [tokenList[0], tokenList[1], tokenList[2], parenthesisToken],
        rules: [ch(['extend', 'message']), ch(isText), ch('{'), ch('}')],
    });

    const [, messageNameToken] = cut(tokenList, len - 1);

    return parseMessageBody(tokenList, messageNameToken.text);
}
