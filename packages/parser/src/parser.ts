import {tokenizer} from '@protobuf.ts/tokenizer';
import {parse} from './_helpers/parse';

export function parser(buf: string | Buffer) {
    const tokenList = tokenizer(buf.toString());

    try {
        return parse(tokenList);
    } catch (e) {
        // if (e instanceof Thrower) {
        //     e.addLine(lines[lines.length - tokenList.length]);
        // }
        throw e;
    }
}
