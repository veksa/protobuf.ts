import {IToken} from '@protobuf.ts/tokenizer';
import {Reserved} from '../parser.interface';
import {ch, check, cut, cutStr} from '../_helpers/utils';
import {isNumber, isText} from '../_helpers/validators';
import {Thrower} from '../_helpers/thrower';

export function parseReservedItem(tokenList: IToken[]): Reserved {
    const {results, len, errors} = check({
        tokenList,
        rules: [ch(isNumber, {result: true}), ch('to'), ch(['max', isNumber], {result: true})],
    });

    if (errors.length === 0) {
        cut(tokenList, len);

        const from = Number(results[0]);
        const to = results[1] === 'max' ? 0x1fffffff : Number(results[1]);

        return {from, to};
    }

    const inner = check({
        tokenList,
        rules: [ch([isNumber, isText], {result: true})],
    });

    if (inner.errors.length === 0) {
        cut(tokenList, inner.len);

        const res = inner.results[0];
        return isNumber(res) ? Number(res) : cutStr(res);
    }

    throw new Thrower('reserved', errors.concat(inner.errors));
}
