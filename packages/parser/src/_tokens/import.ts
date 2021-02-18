import {ch, check, cut, cutStr} from '../_helpers/utils';
import {isStr} from '../_helpers/validators';

export function parseImport(tokens: string[]) {
    const {len, results} = check({
        type: 'import',
        tokens,
        rules: [ch('import'), ch(isStr, {result: true}), ch(';')],
    });

    cut(tokens, len);
    return cutStr(results[0]);
}
