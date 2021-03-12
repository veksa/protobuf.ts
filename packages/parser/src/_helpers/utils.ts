import {isPresent, isString, isText} from '@protobuf.ts/typeguard';
import {IToken} from '@protobuf.ts/tokenizer';
import {Thrower} from './thrower';
import {Option, Options} from '../parser.interface';

export const cut = <T>(arr: T[], count: number) => {
    return arr.splice(0, count);
};

export const cutStr = (str?: string) => {
    return str?.slice(1, -1) ?? '';
};

type Validator = string | ((item?: string) => boolean);

type CheckConfig = {
    strict?: boolean;
    ignore?: boolean;
    result?: boolean;
};

export const ch = (rule: Validator | Validator[], config?: CheckConfig) => {
    return {
        rule,
        config,
    };
};

type Checks = ReturnType<typeof ch>;

interface ICheckParams {
    type?: string;
    rules: Checks[];
    tokenList: IToken[];
}

export function check(params: ICheckParams) {
    const {type, rules, tokenList} = params;

    const errors: [string, number][] = [];
    const results: string[] = [];
    const range: IToken[] = tokenList.slice(0, rules.length);

    let len = 0;

    for (let i = 0; i < rules.length; i++) {
        const {rule, config} = rules[i];
        const val = Array.isArray(rule) ? rule : [rule];
        const token = tokenList[config?.strict === true ? i : len] ?? '';
        let valid = false;

        for (const validator of val) {
            if (!valid) {
                valid = typeof validator === 'function'
                    ? validator(token.text)
                    : token.text === validator;
            }
        }

        if (config?.result === true) {
            results.push(valid ? token.text : '');
        }
        if (!valid && config?.ignore !== true) {
            errors.push([`Token "${token.text}" not equal "${val.join(',')}"`, i]);
        }
        if (valid || (!valid && config?.ignore !== true)) {
            len++;
        }
    }

    if (errors.length > 0 && isString(type)) {
        errors.push([range.join(', '), 0]);
        throw new Thrower(type, errors);
    }

    return {
        errors,
        results,
        range,
        len,
    };
}

export const semicolon = (tokenList: IToken[]) => {
    if (tokenList[0].text === ';') {
        tokenList.shift();
    }
};

export function insertOption(
    result: Options,
    field: string | undefined,
    out: string | boolean | Options | Option[] | undefined,
) {
    if (!isText(field)) {
        throw new Thrower('insert option', [['No any field name', 0]]);
    }

    if (isPresent(result[field])) {
        if (Array.isArray(result[field])) {
            if (Array.isArray(out)) {
                result[field] = (result[field] as Option[]).concat(out);
            } else {
                (result[field] as Option[]).push(out);
            }
        } else {
            result[field] = [result[field]];
            (result[field] as Option[]).push(out);
        }
    } else {
        result[field] = out;
    }
}
