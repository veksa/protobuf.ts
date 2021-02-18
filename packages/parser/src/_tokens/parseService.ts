import {next, setComment, writeComment} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Service} from '../parser.interface';
import {ch, check, cut, insertOption, semicolon} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseRPC} from './parseRpc';
import {parseOptions} from './parseOptions';

export function parseService(tokens: string[]) {
    const {results, len} = check({
        type: 'service',
        tokens,
        rules: [ch('service'), ch(isText, {result: true}), ch('{')],
    });

    cut(tokens, len);

    const service: Service = {
        name: results[0],
        methods: [],
        options: {},
    };

    setComment(service);

    while (tokens.length > 0) {
        if (tokens[0] === '}') {
            tokens.shift();
            semicolon(tokens);
            writeComment(service);
            return service;
        }

        switch (next(tokens)) {
            case 'option': {
                const {field, value} = parseOptions(tokens);
                insertOption(service.options, field, value);
                break;
            }

            case 'rpc':
                service.methods.push(parseRPC(tokens));
                break;

            case undefined:
                continue;

            default:
                throw new Thrower('rpc', [[`Unexpected token in service: ${tokens[0]}`, 0]]);
        }
    }

    throw new Thrower('rpc', [['no close tag "}"', 0]]);
}
