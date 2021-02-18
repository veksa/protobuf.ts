import {ch, check, cut, semicolon} from '../_helpers/utils';
import {parseOption} from './parseOption';

export function parseOptions(tokens: string[]) {
    const {len} = check({tokens, rules: [ch('option')], type: 'option'});

    cut(tokens, len);

    const result = parseOption(tokens);

    semicolon(tokens);

    return result;
}
