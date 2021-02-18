import {isPresent} from '@protobuf.ts/typeguard';
import {next, setComment, writeComment} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Option, Options} from '../parser.interface';
import {ch, check, cut, cutStr, insertOption, semicolon} from '../_helpers/utils';
import {isNumber, isStr, isText} from '../_helpers/validators';

const parse = (value?: string) => {
    return value === 'true'
        ? true
        : value === 'false'
            ? false
            : isNumber(value)
                ? value
                : isStr(value)
                    ? cutStr(value)
                    : value;
};

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

export function parseOptionArray(tokens: string[]): Option[] {
    const options: Option[] = [];

    while (tokens.length > 0) {
        switch (next(tokens)) {
            case '[':
            case ',':
                cut(tokens, 1);
                options.push(parseOptionValue(tokens));
                break;

            case ']':
                cut(tokens, 1);
                return options;

            case undefined:
                continue;

            default:
                throw new Thrower('options array', [[`Unexpected token "${tokens[0]}"`, 0]]);
        }
    }

    throw new Thrower('options array', [['no close tag "]"', 0]]);
}

export function parseOption(tokens: string[]) {
    const {len, results} = check({
        type: 'option',
        tokens,
        rules: [
            ch('(', {ignore: true}),
            ch(isText, {result: true}),
            ch(')', {ignore: true}),
            ch(isText, {result: true, ignore: true}),
            ch('='),
            ch([isText, '{']),
        ],
    });

    cut(tokens, len - 1);
    const field = results[0] + results[1];
    const value = parseOptionValue(tokens);

    return {field, value};
}

export function parseInnerOptions(tokens: string[]) {
    const options: Options = {};

    setComment(options);

    while (tokens.length > 0) {
        switch (next(tokens)) {
            case '[':
            case ',': {
                cut(tokens, 1);
                const {field, value} = parseOption(tokens);

                const path = field.split('.');
                const lastFieldName = path.pop();

                let opt = options;

                for (const p of path) {
                    if (!isPresent(opt[p])) {
                        opt[p] = {};
                    }
                    opt = opt[p] as Options;
                }

                insertOption(opt, lastFieldName, value);
                break;
            }

            case ']':
                cut(tokens, 1);
                writeComment(options);
                return options;

            case undefined:
                continue;

            default:
                throw new Thrower('inner options', [[`Unexpected token "${tokens[0]}"`, 0]]);
        }
    }

    throw new Thrower('inner options', [['no close tag "]"', 0]]);
}

export function parseOptions(tokens: string[]) {
    const {len} = check({tokens, rules: [ch('option')], type: 'option'});

    cut(tokens, len);

    const result = parseOption(tokens);

    semicolon(tokens);

    return result;
}
