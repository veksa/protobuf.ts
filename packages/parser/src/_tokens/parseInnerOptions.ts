import {isPresent} from '@protobuf.ts/typeguard';
import {Options} from '../parser.interface';
import {next, setComment, writeComment} from '../_helpers/comment';
import {cut, insertOption} from '../_helpers/utils';
import {Thrower} from '../_helpers/thrower';
import {parseOption} from './parseOption';

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
