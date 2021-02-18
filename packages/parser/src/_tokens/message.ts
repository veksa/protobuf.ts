import {isObject} from '@protobuf.ts/typeguard';
import {next, setComment, writeComment} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Message} from '../parser.interface';
import {ch, check, cut, insertOption} from '../_helpers/utils';
import {isNumber, isText} from '../_helpers/validators';
import {parseEnums} from './enums';
import {parseExtensions} from './extensions';
import {parseField} from './field';
import {parseOneOf} from './oneof';
import {parseOptions} from './options';
import {parseReserved} from './reserved';

export function parseExtend(tokens: string[]) {
    return {
        name: tokens[1],
        message: parseMessage(tokens),
    };
}

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

function checkReserved(message: Message) {
    for (const reserved of message.reserved) {
        for (const reserve of reserved) {
            for (const field of message.fields) {
                if (isText(reserve) && reserve === field.name) {
                    throw new Thrower('reserved', [[`Field name "${field.name}" in message "${message.name}" is reserved`, 0]]);
                } else if (isNumber(reserve) && reserve === field.tag) {
                    throw new Thrower('reserved', [
                        [`Field "${field.name}" in message "${message.name}" with tag "${field.tag}" is reserved`, 0],
                    ]);
                } else if (isObject(reserve) && reserve.from <= field.tag && field.tag <= reserve.to) {
                    throw new Thrower('reserved', [
                        [
                            // eslint-disable-next-line max-len
                            `Field "${field.name}" with tag "${field.tag}" in message "${message.name}" is reserved between ${reserve.from} to ${reserve.to}`,
                            0,
                        ],
                    ]);
                }
            }
        }
    }
}

export function parseMessage(tokens: string[]) {
    const {len} = check({
        type: 'message',
        tokens: [tokens[0], tokens[1], tokens[2], tokens[tokens.indexOf('}')]],
        rules: [ch(['extend', 'message']), ch(isText), ch('{'), ch('}')],
    });

    const [, messageName] = cut(tokens, len - 1);

    return parseMessageBody(tokens, messageName);
}
