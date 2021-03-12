export enum Block {
    none = 'none',
    comment = 'comment',
    multiComment = 'multiComment',
    singleQuoteString = 'singleQuoteString',
    doubleQuoteString = 'doubleQuoteString',
}

export interface IToken {
    text: string;
    line: number;
    column: number;
}
