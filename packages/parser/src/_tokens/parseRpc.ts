import {IToken} from '@protobuf.ts/tokenizer';
import {next, setComment, writeComment} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Method} from '../parser.interface';
import {ch, check, cut, insertOption, semicolon} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseOptions} from './parseOptions';

export function parseRPC(tokenList: IToken[]) {
    const {results, len} = check({
        type: 'rpc',
        tokenList,
        rules: [
            ch('rpc'),
            ch(isText, {result: true}),
            ch('('),
            ch('stream', {ignore: true, result: true}),
            ch(isText, {result: true}),
            ch(')'),
            ch('returns'),
            ch('('),
            ch('stream', {ignore: true, result: true}),
            ch(isText, {result: true}),
            ch(')'),
        ],
    });

    cut(tokenList, len);

    const rpc: Method = {
        name: results[0],
        inputType: results[2],
        outputType: results[4],
        clientStreaming: results[1] === 'stream',
        serverStreaming: results[3] === 'stream',
        options: {},
    };

    setComment(rpc);

    if (tokenList[0].text === ';') {
        tokenList.shift();
        return rpc;
    }

    const parenthesisToken = tokenList.find(token => {
        return token.text === '}';
    });

    check({
        type: 'rpc',
        tokenList: [tokenList[0], parenthesisToken],
        rules: [ch('{'), ch('}')],
    });

    tokenList.shift();

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case '}':
                cut(tokenList, 1);
                semicolon(tokenList);
                writeComment(rpc);
                return rpc;

            case 'option': {
                const {field, value} = parseOptions(tokenList);
                insertOption(rpc.options, field, value);
                break;
            }

            case undefined:
                continue;

            default:
                throw new Thrower('rpc', [[`Unexpected token "${tokenList[0].text}"`, 0]]);
        }
    }

    throw new Thrower('rpc', [['no close tag "}"', 0]]);
}
