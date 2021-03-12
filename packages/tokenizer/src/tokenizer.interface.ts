export enum Block {
    none = 'none',
    comment = 'comment',
    multiComment = 'multiComment',
    singleQuoteString = 'singleQuoteString',
    doubleQuoteString = 'doubleQuoteString',
}

export interface IToken {
    token: string;
    line: number;
    column: number;
}
