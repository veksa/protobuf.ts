import {Thrower} from './_helpers/thrower';
import {tokenizer} from './_helpers/tokenizer';
import {parse} from './_helpers/parse';

export function parser(buf: string | Buffer) {
    const {tokens, lines, columns} = tokenizer(buf.toString());

    try {
        return parse(tokens);
    } catch (e) {
        if (e instanceof Thrower) {
            e.addRange(tokens);
            e.addLine(lines[lines.length - tokens.length]);
            e.addColumn(columns[lines.length - tokens.length + e.message[0][1]]);
        }
        throw e;
    }
}
