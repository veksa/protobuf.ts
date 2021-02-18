import {parseMessage} from './parseMessage';

export function parseExtend(tokens: string[]) {
    return {
        name: tokens[1],
        message: parseMessage(tokens),
    };
}
