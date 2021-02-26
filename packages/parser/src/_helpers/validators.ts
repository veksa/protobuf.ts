import {SYMBOLS} from '../tokenizer/tokenizer';
import {cutStr} from './utils';

export function isStr(str?: unknown): str is string {
    return isText(str)
        ? (str.slice(0, 1) === '"' && str.slice(-1) === '"') || (str.slice(0, 1) === '\'' && str.slice(-1) === '\'')
        : false;
}

isStr.toString = () => {
    return ' string with quotes "..." or \'...\' ';
};

export function isText(str?: unknown): str is string {
    return typeof str === 'string' && !SYMBOLS[str];
}

isText.toString = () => {
    return 'string';
};

export function isNumber(str?: unknown): str is number {
    return !Number.isNaN(Number(str));
}

isNumber.toString = () => {
    return 'number';
};

export function isProto(str?: string) {
    const s = cutStr(str);
    return s === 'proto2' || s === 'proto3';
}

isProto.toString = () => {
    return ' string with quotes "proto2" or "proto3" ';
};
