import {next} from '../_helpers/comment';
import {Thrower} from '../_helpers/thrower';
import {Field} from '../parser.interface';
import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';
import {parseField} from './field';

export function parseOneOf(tokens: string[]) {
    const fields: Field[] = [];

    const {len, results} = check({
        type: 'oneof',
        tokens,
        rules: [ch('oneof'), ch(isText, {result: true}), ch('{')],
    });

    cut(tokens, len);

    const fieldName = results[0];

    while (tokens.length > 0) {
        switch (next(tokens)) {
            case '}':
                cut(tokens, 1);

                return fields;

            case undefined:
                continue;

            default: {
                const field = parseField(tokens, true);
                field.oneof = fieldName;
                fields.push(field);
            }
        }
    }

    throw new Thrower('oneof', [['no close tag "}"', 0]]);
}
