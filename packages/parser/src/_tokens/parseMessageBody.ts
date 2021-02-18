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

export function parseMessageBody(tokens: string[], name: string) {
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

    while (tokens.length > 0) {
        switch (next(tokens)) {
            case '}':
                tokens.shift();
                writeComment(message);
                checkReserved(message);
                return message;

            case 'map':
            case 'repeated':
            case 'optional':
            case 'required':
                message.fields.push(parseField(tokens));
                break;

            case 'enum':
                message.enums.push(parseEnums(tokens));
                break;

            case 'message':
                message.messages.push(parseMessage(tokens));
                break;

            case 'extensions':
                message.extensions.push(parseExtensions(tokens));
                break;

            case 'oneof':
                message.fields = message.fields.concat(parseOneOf(tokens));
                break;

            case 'extend':
                message.extends.push(parseExtend(tokens));
                break;

            case ';':
                tokens.shift();
                break;

            case 'reserved':
                message.reserved.push(parseReserved(tokens));
                break;

            case 'option': {
                const {field, value} = parseOptions(tokens);
                insertOption(message.options, field, value);
                break;
            }

            case undefined:
                continue;

            default:
                message.fields.push(parseField(tokens, true));
        }
    }

    throw new Thrower('message', [['no close tag "}"', 0]]);
}
