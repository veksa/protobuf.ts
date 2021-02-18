import {Thrower} from '../../_helpers/thrower';
import {parseRPC} from '../rpc';

describe('Rpc', () => {
    test('Rpc empty', () => {
        let i = 0;

        const prox = new Proxy(['rpc', 'name', '(', 'name', ')', 'returns', '(', 'name', ')', '{', '}', 'comment'], {
            get(target, prop: number) {
                if (target[prop] === '}') {
                    const text = i < 4 ? '}' : '//';
                    i++;
                    return text;
                } else {
                    return target[prop];
                }
            },
        });

        let er: unknown;
        try {
            parseRPC(prox);
        } catch (e) {
            er = e;
        }

        expect(er).toEqual(new Thrower('rpc', [['no close tag "}"', 0]]));
    });
});
