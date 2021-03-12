import {IToken} from '@protobuf.ts/tokenizer';
import {next, setComment, writeComment} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Field} from '../parser.interface';
import {parseMap} from './parseMap';
import {parseInnerOptions} from './parseInnerOptions';

export function parseField(tokenList: IToken[], empty = false) {
    const field: Field = {
        name: '',
        type: '',
        tag: -1,
        required: false,
        repeated: false,
        optional: false,
        options: {},
    };

    setComment(field);

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case '=':
                tokenList.shift();
                field.tag = Number(tokenList.shift());
                break;

            case 'map': {
                const {type, map, name} = parseMap(tokenList);
                field.type = type;
                field.map = map;
                field.name = name;
                break;
            }

            case 'repeated':
            case 'required':
            case 'optional': {
                const token = tokenList.shift();
                field.required = token.text === 'required';
                field.repeated = token.text === 'repeated';
                field.optional = token.text === 'optional';
                field.type = tokenList.shift().text;
                field.name = tokenList.shift().text;
                writeComment(field);
                break;
            }

            case '[':
                field.options = parseInnerOptions(tokenList);
                break;

            case ';':
                if (field.name === '') {
                    throw new Thrower('field', [['Missing field name', 0]]);
                }

                if (field.type === '') {
                    throw new Thrower('field', [[`Missing type in message field: ${field.name}`, 0]]);
                }

                if (field.tag === -1) {
                    throw new Thrower('field', [[`Missing tag number in message field: ${field.name}`, 0]]);
                }

                tokenList.shift();
                return field;

            case undefined:
                continue;

            default:
                if (empty) {
                    field.type = tokenList.shift().text;
                    field.name = tokenList.shift().text;
                    empty = false;
                    writeComment(field);
                } else {
                    throw new Thrower('field', [[`Unexpected token in message field: ${tokenList[0].text}`, 0]]);
                }
        }
    }

    throw new Thrower('field', [['No ; found for message field', 0]]);
}
