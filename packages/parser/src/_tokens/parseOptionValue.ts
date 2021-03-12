import {IToken} from '@protobuf.ts/tokenizer';
import {Option, Options} from '../parser.interface';
import {next} from '../_helpers/comment';
import {cut, cutStr, insertOption} from '../_helpers/utils';
import {Thrower} from '../_helpers/thrower';
import {isNumber, isStr} from '../_helpers/validators';
import {parseOptionArray} from './parseOptionArray';

function parse(value?: string) {
    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    if (isNumber(value)) {
        return value;
    }

    if (isStr(value)) {
        return cutStr(value);
    }

    return value;
}

export function parseOptionValue(tokenList: IToken[]): Option {
    const value = tokenList.shift();

    if (value !== '{') {
        return parse(value);
    }

    const result: Options = {};

    let field: string | undefined;

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case '}':
                cut(tokenList, 1);
                return result;

            case ':':
                cut(tokenList, 1);
                insertOption(
                    result,
                    field,
                    tokenList[0] === '['
                        ? parseOptionArray(tokenList)
                        : parseOptionValue(tokenList),
                );
                break;

            case '{':
                insertOption(result, field, parseOptionValue(tokenList));
                break;

            case undefined:
                continue;

            default:
                field = tokenList.shift();
        }
    }

    throw new Thrower('option array', [['no close tag "}"', 0]]);
}
