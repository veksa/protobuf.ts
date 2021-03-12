import {isPresent} from '@protobuf.ts/typeguard';
import {IToken} from '@protobuf.ts/tokenizer';
import {Options} from '../parser.interface';
import {next, setComment, writeComment} from '../_helpers/comment';
import {insertOption} from '../_helpers/utils';
import {Thrower} from '../_helpers/thrower';
import {parseOption} from './parseOption';

export function parseInnerOptions(tokenList: IToken[]) {
    const options: Options = {};

    setComment(options);

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case '[':
            case ',': {
                tokenList.splice(0, 1);
                const {field, value} = parseOption(tokenList);

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
                tokenList.splice(0, 1);
                writeComment(options);
                return options;

            case undefined:
                continue;

            default:
                throw new Thrower('inner options', [[`Unexpected token "${tokenList[0].text}"`, 0]]);
        }
    }

    throw new Thrower('inner options', [['no close tag "]"', 0]]);
}
