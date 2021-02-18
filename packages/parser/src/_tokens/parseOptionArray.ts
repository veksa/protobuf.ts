import {Option} from '../parser.interface';
import {next} from '../_helpers/comment';
import {cut} from '../_helpers/utils';
import {Thrower} from '../_helpers/thrower';
import {parseOptionValue} from './parseOptionValue';

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
