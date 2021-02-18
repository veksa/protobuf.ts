import {ch, check, cut} from '../_helpers/utils';
import {isText} from '../_helpers/validators';

export function parsePackage(tokens: string[]) {
    const {len, results} = check({
        type: 'package',
        tokens,
        rules: [ch('package'), ch(isText, {result: true}), ch(';')],
    });

    cut(tokens, len);
    return results[0];
}
