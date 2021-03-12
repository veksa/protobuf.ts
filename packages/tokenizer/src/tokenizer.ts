import {Empty, Symbol} from './tokenizer.constant';
import {Block, IToken} from './tokenizer.interface';

export function tokenizer(source: string): IToken[] {
    const tokenList: IToken[] = [];

    let text = '';
    let block: Block = Block.none;
    let line = 1;
    let column = 1;
    let isSameLine = true;

    const finalize = (after = false, force = false) => {
        if (text.length > 0 || force) {
            tokenList.push({
                text,
                line,
                column: after
                    ? column
                    : column - text.length,
            });
            text = '';
        }
    };

    for (let i = 0; i < source.length; i++) {
        const cur = source[i];
        const next = source[i + 1];

        if (block === Block.none && cur + next === '//') {
            finalize();
            block = Block.comment;
            text += isSameLine ? '!//' : '//';
            finalize(true);
            i++;
            column++;
        } else if (block === Block.comment && cur === '\n') {
            block = Block.none;
            finalize(false, true);
        } else if (block === Block.none && cur + next === '/*') {
            block = Block.multiComment;
            finalize();
            text = '/*';
            finalize(true);
            i++;
            column++;
        } else if (block === Block.multiComment && cur + next === '*/') {
            block = Block.none;
            finalize(false, true);
            text = '*/';
            finalize(true);
            i++;
            column++;
        } else if (block === Block.none && cur === '\'') {
            finalize();
            text = cur;
            block = Block.singleQuoteString;
        } else if (block === Block.singleQuoteString && cur + next === '\\\'') {
            text += '\'';
            i++;
        } else if (block === Block.singleQuoteString && cur === '\'') {
            text += cur;
            finalize();
            block = Block.none;
        } else if (block === Block.none && cur === '"') {
            finalize();
            text = cur;
            block = Block.doubleQuoteString;
        } else if (block === Block.doubleQuoteString && cur + next === '\\"') {
            text += '"';
            i++;
        } else if (block === Block.doubleQuoteString && cur === '"') {
            text += cur;
            finalize();
            block = Block.none;
        } else if (block === Block.none && Symbol[cur]) {
            finalize();
            text = cur;
            finalize(true);
        } else if (block === Block.none && Empty[cur]) {
            finalize();
        } else {
            text += cur;
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
