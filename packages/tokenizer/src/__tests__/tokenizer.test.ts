import {tokenizer} from '../tokenizer';

describe('tokenizer', () => {
    test('should add simple text', () => {
        const actual = tokenizer(
`
text
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add text with spaces', () => {
        const actual = tokenizer(
            `
text with spaces
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add expression', () => {
        const actual = tokenizer(
            `
a = b
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add text escapes', () => {
        const actual = tokenizer(
            `
text \\ escapes
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add single quoted text', () => {
        const actual = tokenizer(
            `
single quoted 'text with spaces'
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add single quoted escaped text', () => {
        const actual = tokenizer(
            `
single quoted 'text\\'s spaces'
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add double quoted text', () => {
        const actual = tokenizer(
            `
double quoted "text with spaces"
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add double quoted escaped text', () => {
        const actual = tokenizer(
            `
double quoted "text\\"s spaces"
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add single line commented text', () => {
        const actual = tokenizer(
            `
text
// with comment
`,
        );

        expect(actual).toMatchSnapshot();
    });

    test('should add multi line commented text', () => {
        const actual = tokenizer(
            `
text
/*
with
comment
*/
`,
        );

        expect(actual).toMatchSnapshot();
    });
});
