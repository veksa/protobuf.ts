import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseMessageBody} from './parseMessageBody';

export function parseMessage(tokens: string[]) {
    const {len} = check({
        type: 'message',
        tokens: [tokens[0], tokens[1], tokens[2], tokens[tokens.indexOf('}')]],
        rules: [ch(['extend', 'message']), ch(isText), ch('{'), ch('}')],
    });

    const [, messageName] = cut(tokens, len - 1);

    return parseMessageBody(tokens, messageName);
}
