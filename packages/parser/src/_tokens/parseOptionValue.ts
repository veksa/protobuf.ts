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

export function parseOptionValue(tokens: string[]): Option {
    const value = tokens.shift();

    if (value !== '{') {
        return parse(value);
    }

    const result: Options = {};

    let field: string | undefined;

    while (tokens.length > 0) {
        switch (next(tokens)) {
            case '}':
                cut(tokens, 1);
                return result;

            case ':':
                cut(tokens, 1);
                insertOption(result, field, tokens[0] === '[' ? parseOptionArray(tokens) : parseOptionValue(tokens));
                break;

            case '{':
                insertOption(result, field, parseOptionValue(tokens));
                break;

            case undefined:
                continue;

            default:
                field = tokens.shift();
        }
    }

    throw new Thrower('option array', [['no close tag "}"', 0]]);
}
