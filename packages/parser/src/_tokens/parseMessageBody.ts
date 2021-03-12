import {next, setComment, writeComment} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Message} from '../parser.interface';
import {insertOption} from '../_helpers/utils';
import {parseEnums} from './parseEnums';
import {parseExtensions} from './parseExtensions';
import {parseField} from './parseField';
import {parseOneOf} from './parseOneof';
import {parseReserved} from './parseReserved';
import {parseExtend} from './parseExtend';
import {parseMessage} from './parseMessage';
import {checkReserved} from './checkReserved';
import {parseOptions} from './parseOptions';
import {IToken} from '../../../tokenizer';

export function parseMessageBody(tokenList: IToken[], name: string) {
    const message: Message = {
        name,
        enums: [],
        options: {},
        messages: [],
        fields: [],
        extends: [],
        extensions: [],
        reserved: [],
    };

    setComment(message);

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case '}':
                tokenList.shift();
                writeComment(message);
                checkReserved(message);
                return message;

            case 'map':
            case 'repeated':
            case 'optional':
            case 'required':
                message.fields.push(parseField(tokenList));
                break;

            case 'enum':
                message.enums.push(parseEnums(tokenList));
                break;

            case 'message':
                message.messages.push(parseMessage(tokenList));
                break;

            case 'extensions':
                message.extensions.push(parseExtensions(tokenList));
                break;

            case 'oneof':
                message.fields = message.fields.concat(parseOneOf(tokenList));
                break;

            case 'extend':
                message.extends.push(parseExtend(tokenList));
                break;

            case ';':
                tokenList.shift();
                break;

            case 'reserved':
                message.reserved.push(parseReserved(tokenList));
                break;

            case 'option': {
                const {field, value} = parseOptions(tokenList);
                insertOption(message.options, field, value);
                break;
            }

            case undefined:
                continue;

            default:
                message.fields.push(parseField(tokenList, true));
        }
    }

    throw new Thrower('message', [['no close tag "}"', 0]]);
}
