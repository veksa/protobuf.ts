import {readdirSync, readFileSync, unlinkSync, writeFileSync} from 'fs';
import {join} from 'path';
import {parser} from '../parser';

const successPath = 'success';
const errorPath = 'error';

const readFile = (name: string, folder = successPath) => {
    return readFileSync(join(__dirname, folder, name), 'utf-8');
};

const writeFile = (name: string, body: string, folder = successPath) => {
    return writeFileSync(join(__dirname, folder, name), body, 'utf-8');
};

const readJSON = (file: string, folder = successPath) => {
    return JSON.parse(readFileSync(join(__dirname, folder, `${file.replace('.proto', '.json')}`), 'utf8'), (_, i: unknown) => {
        return (i === null ? undefined : i);
    }) as Record<string, unknown>;
};

const deleteFile = (name: string, folder = successPath) => {
    return unlinkSync(join(__dirname, folder, name));
};
const filterProto = (file: string) => {
    return /\.proto$/.test(file);
};

const successFiles = readdirSync(join(__dirname, successPath));
const errorFiles = readdirSync(join(__dirname, errorPath));

describe('parser', () => {
    describe(successPath, () => {
        successFiles.filter(filterProto).forEach((file) => {
            test(file, () => {
                const parsed = parser(readFile(file));
                const fName = file.replace('.proto', '.diff.json');

                writeFile(fName, JSON.stringify(parsed, null, 2));
                expect(parsed).toEqual(readJSON(file));
                deleteFile(fName);
            });
        });
    });

    describe(errorPath, () => {
        errorFiles.filter(filterProto).forEach((file) => {
            test(file, () => {
                let error = false;
                const fName = file.replace('.proto', '.diff.json');

                try {
                    parser(readFile(file, errorPath));
                } catch (e) {
                    error = true;
                    writeFile(fName, JSON.stringify(e, null, 2), errorPath);
                    expect(e).toEqual(readJSON(file, errorPath));
                    deleteFile(fName, errorPath);
                }

                expect(error).toBe(true);
            });
        });
    });
});
