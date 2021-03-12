import {IToken} from '@protobuf.ts/tokenizer';
import {next} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Reserved} from '../parser.interface';
import {cut} from '../_helpers/utils';
import {parseReservedItem} from './parseReservedItem';

export function parseReserved(tokenList: IToken[]): Reserved[] {
    const reserved: Reserved[] = [];

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case 'reserved':
            case ',':
                cut(tokenList, 1);
                reserved.push(parseReservedItem(tokenList));
                break;

            case ';':
                cut(tokenList, 1);
                return reserved;

            case undefined:
                continue;

            default:
                throw new Thrower('reserved', [[`Unexpected token "${tokenList[0].text}"`, 0]]);
        }
    }

    throw new Thrower('reserved', [['no close tag ";"', 0]]);
}
