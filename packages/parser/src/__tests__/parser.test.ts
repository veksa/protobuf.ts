import {readdirSync, readFileSync} from 'fs';
import {join} from 'path';
import {parser} from '../parser';

const successPath = 'success';
const errorPath = 'error';

describe('parser', () => {
    describe(successPath, () => {
        readdirSync(join(__dirname, successPath)).filter(file => {
            return /\.proto$/.test(file);
        }).forEach((file) => {
            test(file, () => {
                const content = readFileSync(join(__dirname, successPath, file), 'utf-8');
                const parsed = parser(content);

                const json = JSON.stringify(parsed, null, 2);

                const expected = readFileSync(join(__dirname, successPath, `${file.replace('.proto', '.json')}`), 'utf8');

                expect(json).toEqual(JSON.parse(expected));
            });
        });
    });

    describe(errorPath, () => {
        readdirSync(join(__dirname, errorPath)).filter(file => {
            return /\.proto$/.test(file);
        }).forEach((file) => {
            test(file, () => {
                expect.assertions(1);

                const content = readFileSync(join(__dirname, errorPath, file), 'utf-8');

                try {
                    parser(content);
                } catch (error) {
                    const expected = readFileSync(join(__dirname, errorPath, `${file.replace('.proto', '.json')}`), 'utf8');

                    expect(error).toEqual(expected);
                }
            });
        });
    });
});
