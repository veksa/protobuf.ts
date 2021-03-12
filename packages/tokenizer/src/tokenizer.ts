import {Empty, Symbol} from './tokenizer.constant';
import {Block, IToken} from './tokenizer.interface';

export function tokenizer(source: string): IToken[] {
    const tokenList: IToken[] = [];

    let token = '';
    let block: Block = Block.none;
    let line = 1;
    let column = 1;
    let isSameLine = true;

    const finalize = (after = false, force = false) => {
        if (token.length > 0 || force) {
            tokenList.push({
                token,
                line,
                column: after
                    ? column
                    : column - token.length,
            });
            token = '';
        }
    };

    for (let i = 0; i < source.length; i++) {
        const cur = source[i];
        const next = source[i + 1];

        if (block === Block.none && cur + next === '//') {
            finalize();
            block = Block.comment;
            token += isSameLine ? '!//' : '//';
            finalize(true);
            i++;
            column++;
        } else if (block === Block.comment && cur === '\n') {
            block = Block.none;
            finalize(false, true);
        } else if (block === Block.none && cur + next === '/*') {
            block = Block.multiComment;
            finalize();
            token = '/*';
            finalize(true);
            i++;
            column++;
        } else if (block === Block.multiComment && cur + next === '*/') {
            block = Block.none;
            finalize(false, true);
            token = '*/';
            finalize(true);
            i++;
            column++;
        } else if (block === Block.none && cur === '\'') {
            finalize();
            token = cur;
            block = Block.singleQuoteString;
        } else if (block === Block.singleQuoteString && cur + next === '\\\'') {
            token += '\'';
            i++;
        } else if (block === Block.singleQuoteString && cur === '\'') {
            token += cur;
            finalize();
            block = Block.none;
        } else if (block === Block.none && cur === '"') {
            finalize();
            token = cur;
            block = Block.doubleQuoteString;
        } else if (block === Block.doubleQuoteString && cur + next === '\\"') {
            token += '"';
            i++;
        } else if (block === Block.doubleQuoteString && cur === '"') {
            token += cur;
            finalize();
            block = Block.none;
        } else if (block === Block.none && Symbol[cur]) {
            finalize();
            token = cur;
            finalize(true);
        } else if (block === Block.none && Empty[cur]) {
            finalize();
        } else {
            token += cur;
        }

        if (block === Block.none && cur === '\n') {
            column = 1;
        } else {
            column++;
        }

        if (cur === '\n') {
            isSameLine = false;
            line++;
        } else if (!Empty[cur]) {
            isSameLine = true;
        }
    }

    return tokenList;
}
