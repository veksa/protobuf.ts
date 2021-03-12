import {tokenizer} from '../tokenizer';

describe('tokenizer', () => {
    test('should add comment line', () => {
        const actual = tokenizer(
`
simple
`
        );

        expect(actual).toMatchSnapshot();
    });
});
