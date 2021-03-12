import {tokenizer} from '../tokenizer';

describe('tokenizer', () => {
    test('should ', () => {
        const actual = tokenizer('// test \n message');

        expect(actual).toMatchSnapshot();
    });
});
