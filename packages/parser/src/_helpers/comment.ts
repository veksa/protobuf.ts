import {isPresent, isText} from '@protobuf.ts/typeguard';
import {IToken} from '@protobuf.ts/tokenizer';

let comment = '';
let lastComment: { comment?: string } = {};

export function writeComment(com: { comment?: string }) {
    const co = (com.comment ?? '') + comment;

    if (isText(co)) {
        com.comment = co;
    }

    comment = '';
    lastComment = com;
}

export function setComment(com: { comment?: string }) {
    lastComment = com;
}

export function cleanComment() {
    comment = '';
}

export function next(tokenList: IToken[]): IToken | undefined {
    while (tokenList.length > 0) {
        const token = tokenList[0];

        switch (token.text) {
            case '//': {
                const commentList = tokenList.splice(0, 2);

                const commentText = comment !== ''
                    ? `${comment}\n`
                    : comment;

                comment = commentText + commentList[1].text;

                break;
            }

            case '/*': {
                const multiCommentList = tokenList.splice(0, 3);

                const commentText = comment !== ''
                    ? `${comment}\n`
                    : comment;

                comment = commentText + multiCommentList[1].text;

                break;
            }

            case '!//': {
                const singleCommentList = tokenList.splice(0, 2);

                const commentText = comment !== ''
                    ? `${comment}\n`
                    : comment;

                comment = commentText + singleCommentList[1].text;

                if (isPresent(lastComment)) {
                    lastComment.comment = comment;
                    comment = '';
                }

                break;
            }

            default:
                return token;
        }
    }

    return tokenList[0];
}
