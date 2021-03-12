import {IToken} from '@protobuf.ts/tokenizer';
import {next} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Field} from '../parser.interface';
import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseField} from './parseField';

export function parseOneOf(tokenList: IToken[]) {
    const fields: Field[] = [];

    const {len, results} = check({
        type: 'oneof',
        tokenList,
        rules: [ch('oneof'), ch(isText, {result: true}), ch('{')],
    });

    cut(tokenList, len);

    const fieldName = results[0];

    while (tokenList.length > 0) {
        switch (next(tokenList)) {
            case '}':
                cut(tokenList, 1);

                return fields;

            case undefined:
                continue;

            default: {
                const field = parseField(tokenList, true);
                field.oneof = fieldName;
                fields.push(field);
            }
        }
    }

    throw new Thrower('oneof', [['no close tag "}"', 0]]);
}
