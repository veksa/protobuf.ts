import {Schema} from '../parser.interface';
import {cleanComment, next, setComment} from './comment';
import {Thrower} from './thrower';
import {parseSyntax} from '../_tokens/syntax';
import {parsePackage} from '../_tokens/package';
import {parseExtend, parseMessage} from '../_tokens/message';
import {parseImport} from '../_tokens/import';
import {parseEnums} from '../_tokens/enums';
import {parseOptions} from '../_tokens/options';
import {insertOption} from './utils';
import {parseService} from '../_tokens/service';
import {extend} from './extend';

export function parse(tokens: string[]) {
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

    while (tokens.length > 0) {
        switch (next(tokens)) {
            case 'syntax':
                if (!first) {
                    throw new Thrower('syntax', [['must be on first line', 0]]);
                }
                schema.syntax = parseSyntax(tokens);
                break;

            case 'package':
                schema.package = parsePackage(tokens);
                break;

            case 'message':
                schema.messages.push(parseMessage(tokens));
                break;

            case 'import':
                schema.imports.push(parseImport(tokens));
                break;

            case 'enum':
                schema.enums.push(parseEnums(tokens));
                break;

            case 'option': {
                const {field, value} = parseOptions(tokens);
                insertOption(schema.options, field, value);
                break;
            }

            case 'extend':
                schema.extends.push(parseExtend(tokens));
                break;

            case 'service':
                schema.services.push(parseService(tokens));
                break;

            default:
                throw new Thrower('common', [[`Unexpected token: ${tokens[0]}`, 0]]);
        }
        first = false;
    }

    extend(schema);

    return schema;
}
