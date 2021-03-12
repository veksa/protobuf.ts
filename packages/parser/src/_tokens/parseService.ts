import {IToken} from '@protobuf.ts/tokenizer';
import {next, setComment, writeComment} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Service} from '../parser.interface';
import {ch, check, cut, insertOption, semicolon} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseRPC} from './parseRpc';
import {parseOptions} from './parseOptions';

export function parseService(tokenList: IToken[]) {
    const {results, len} = check({
        type: 'service',
        tokenList,
        rules: [ch('service'), ch(isText, {result: true}), ch('{')],
    });

    cut(tokenList, len);

    const service: Service = {
        name: results[0],
        methods: [],
        options: {},
    };

    setComment(service);

    while (tokenList.length > 0) {
        if (tokenList[0].text === '}') {
            tokenList.shift();
            semicolon(tokenList);
            writeComment(service);
            return service;
        }

        switch (next(tokenList)) {
            case 'option': {
                const {field, value} = parseOptions(tokenList);
                insertOption(service.options, field, value);
                break;
            }

            case 'rpc':
                service.methods.push(parseRPC(tokenList));
                break;

            case undefined:
                continue;

            default:
                throw new Thrower('rpc', [[`Unexpected token in service: ${tokenList[0].text}`, 0]]);
        }
    }

    throw new Thrower('rpc', [['no close tag "}"', 0]]);
}
