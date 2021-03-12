import {IToken} from '@protobuf.ts/tokenizer';
import {Option} from '../parser.interface';
import {next} from '../_helpers/comment';
import {cut} from '../_helpers/utils';
import {Thrower} from '../_helpers/thrower';
import {parseOptionValue} from './parseOptionValue';

export function parseOptionArray(tokenList: IToken[]): Option[] {
    const options: Option[] = [];

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case '[':
            case ',':
                cut(tokenList, 1);
                options.push(parseOptionValue(tokenList));
                break;

            case ']':
                cut(tokenList, 1);
                return options;

            case undefined:
                continue;

            default:
                throw new Thrower('options array', [[`Unexpected token "${tokenList[0].text}"`, 0]]);
        }
    }

    throw new Thrower('options array', [['no close tag "]"', 0]]);
}
