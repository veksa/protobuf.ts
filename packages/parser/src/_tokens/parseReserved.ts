import {next} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Reserved} from '../parser.interface';
import {cut} from '../_helpers/utils';
import {parseReservedItem} from './parseReservedItem';

export function parseReserved(tokens: string[]): Reserved[] {
    const reserved: Reserved[] = [];

    while (tokens.length > 0) {
        switch (next(tokens)) {
            case 'reserved':
            case ',':
                cut(tokens, 1);
                reserved.push(parseReservedItem(tokens));
                break;

            case ';':
                cut(tokens, 1);
                return reserved;

            case undefined:
                continue;

            default:
                throw new Thrower('reserved', [[`Unexpected token "${tokens[0]}"`, 0]]);
        }
    }

    throw new Thrower('reserved', [['no close tag ";"', 0]]);
}
