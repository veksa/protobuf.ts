import {IToken} from '@protobuf.ts/tokenizer';
import {next, setComment, writeComment} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Enum} from '../parser.interface';
import {ch, check, insertOption, semicolon} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseOptions} from './parseOptions';
import {parseEnumVal} from './parseEnumVal';

export function parseEnums(tokenList: IToken[]) {
    const parenthesisToken = tokenList.find(token => {
        return token.text === '}';
    });

    const {results} = check({
        type: 'enum',
        tokenList: [tokenList[0], tokenList[1], tokenList[2], parenthesisToken],
        rules: [ch('enum'), ch(isText, {result: true}), ch('{'), ch('}')],
    });

    const en: Enum = {
        name: results[0],
        values: {},
        options: {},
    };

    setComment(en);

    tokenList.splice(0, 3);

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case '}':
                tokenList.splice(0, 1);
                semicolon(tokenList);
                writeComment(en);
                return en;

            case 'option': {
                const {field, value} = parseOptions(tokenList);
                insertOption(en.options, field, value);
                break;
            }

            case undefined:
                continue;

            default: {
                const {name, value} = parseEnumVal(tokenList);
                en.values[name] = value;
                writeComment(en.values[name]);
            }
        }
    }

    throw new Thrower('enum', [['no close tag "}"', 0]]);
}
