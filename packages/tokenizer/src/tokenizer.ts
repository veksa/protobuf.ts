import {Empty, Symbol} from './tokenizer.constant';
import {Block} from './tokenizer.interface';

export function tokenizer(source: string) {
    const tokens: string[] = [];
    const lines: number[] = [];
    const columns: number[] = [];

    let tmp = '';
    let block: Block = Block.none;
    let sameLine = true;
    let curLine = 1;
    let column = 1;

    const finalize = (after = false, force = false) => {
        if (tmp.length > 0 || force) {
            tokens.push(tmp);
            lines.push(curLine);
            columns.push(after ? column : column - tmp.length);
            tmp = '';
        }
    };

    for (let i = 0; i < source.length; i++) {
        const cur = source[i];
        const next = source[i + 1];

        switch (true) {
            case block === Block.none && cur + next === '//':
                finalize();
                block = Block.comment;
                tmp += sameLine ? '!//' : '//';
                finalize(true);
                i++;
                column++;
                break;

            case block === Block.comment && cur === '\n':
                block = Block.none;
                finalize(false, true);
                break;

            case block === Block.none && cur + next === '/*':
                block = Block.multiComment;
                finalize();
                tmp = '/*';
                finalize(true);
                i++;
                column++;
                break;

            case block === Block.multiComment && cur + next === '*/':
                block = Block.none;
                finalize(false, true);
                tmp = '*/';
                finalize(true);
                i++;
                column++;
                break;

            case block === Block.none && cur === '\'':
                finalize();
                tmp = cur;
                block = Block.singleQuoteString;
                break;

            case block === Block.singleQuoteString && cur + next === '\\\'':
                tmp += '\'';
                i++;
                break;

            case block === Block.singleQuoteString && cur === '\'':
                tmp += cur;
                finalize();
                block = Block.none;
                break;

            case block === Block.none && cur === '"':
                finalize();
                tmp = cur;
                block = Block.doubleQuoteString;
                break;

            case block === Block.doubleQuoteString && cur + next === '\\"':
                tmp += '"';
                i++;
                break;

            case block === Block.doubleQuoteString && cur === '"':
                tmp += cur;
                finalize();
                block = Block.none;
                break;

            case block === Block.none && Symbol[cur]:
                finalize();
                tmp = cur;
                finalize(true);
                break;

            case block === Block.none && Empty[cur]:
                finalize();
                break;

            default:
                tmp += cur;
        }

        if (block === Block.none && cur === '\n') {
            column = 1;
        } else {
            column++;
        }

        if (cur === '\n') {
            sameLine = false;
            curLine++;
        } else if (!Empty[cur]) {
            sameLine = true;
        }
    }

    return {
        tokens,
        lines,
        columns,
    };
}
