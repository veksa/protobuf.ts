import {tokenizer} from '@protobuf.ts/tokenizer';
import {parse} from './_helpers/parse';

export function parser(buf: string | Buffer) {
    const {tokens, lines} = tokenizer(buf.toString());
console.log('tokens', tokens, lines);
    try {
        return parse(tokens);
    } catch (e) {
        // if (e instanceof Thrower) {
        //     e.addLine(lines[lines.length - tokens.length]);
        // }
        throw e;
    }
}
