import {IToken} from '@protobuf.ts/tokenizer';
import {Schema} from '../parser.interface';
import {cleanComment, next, setComment} from './comment';
import {Thrower} from './thrower';
import {parseSyntax} from '../_tokens/parseSyntax';
import {parsePackage} from '../_tokens/parsePackage';
import {parseImport} from '../_tokens/parseImport';
import {parseEnums} from '../_tokens/parseEnums';
import {insertOption} from './utils';
import {parseService} from '../_tokens/parseService';
import {extend} from './extend';
import {parseMessage} from '../_tokens/parseMessage';
import {parseOptions} from '../_tokens/parseOptions';
import {parseExtend} from '../_tokens/parseExtend';

export function parse(tokenList: IToken[]) {
    const schema: Schema = {
        syntax: 3,
        imports: [],
        enums: [],
        messages: [],
        options: {},
        extends: [],
        services: [],
    };

    cleanComment();
    setComment(schema);

    let first = true;

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case 'syntax':
                if (!first) {
                    throw new Thrower('syntax', [['must be on first line', 0]]);
                }
                schema.syntax = parseSyntax(tokenList);
                break;

            case 'package':
                schema.package = parsePackage(tokenList);
                break;

            case 'message':
                schema.messages.push(parseMessage(tokenList));
                break;

            case 'import':
                schema.imports.push(parseImport(tokenList));
                break;

            case 'enum':
                schema.enums.push(parseEnums(tokenList));
                break;

            case 'option': {
                const {field, value} = parseOptions(tokenList);
                insertOption(schema.options, field, value);
                break;
            }

            case 'extend':
                schema.extends.push(parseExtend(tokenList));
                break;

            case 'service':
                schema.services.push(parseService(tokenList));
                break;

            default:
                throw new Thrower('common', [[`Unexpected token: ${tokenList[0].text}`, 0]]);
        }
        first = false;
    }

    extend(schema);

    return schema;
}
