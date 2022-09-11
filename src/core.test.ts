import * as path from "path";

jest.mock('@actions/core');
jest.mock('@actions/github');

import * as core from '@actions/core';
import {when} from 'jest-when';
import {getEnvByFile, getExcludesByFile, getMatchesDir, getMatchesFile, renameDir, run} from './core';
import * as fs from "fs";
import {glob} from "glob";

describe('action env [core.js] test', () => {
    beforeEach(() => {
        console.log('-> beforeEach');
    });

    test('test.input', async () => {
        let getInputFn = jest.fn()
        when(getInputFn).calledWith('left_delim').mockReturnValue('<<[');
        when(getInputFn).calledWith('right_delim').mockReturnValue(']>>');
        when(getInputFn).calledWith('path').mockReturnValue('**/*');
        when(getInputFn).calledWith('excludes').mockReturnValue('\.*');
        when(getInputFn).calledWith('overflow_readme_file').mockReturnValue(undefined);
        when(getInputFn).calledWith('env_file').mockReturnValue(undefined);
        when(getInputFn).calledWith('env').mockReturnValue('key=value,key2=value2');
        // core.getInput = getInputFn;
        console.log('getInputFn', core);
        await run({
            left_delim: '<<[',
            right_delim: ']>>',
            path: '**/*',
            exclude: undefined,
            overflow_readme_file: undefined,
            env_file: undefined,
            env: 'key=value,key2=value2',
        });
    });


    test('test.envFile', async () => {
        let text: string = `key1=value1
            key2=value2
        `;
        let result: any = {};
        text.split('\n').filter(line => `${line}`.indexOf('=') > 0).forEach((line) => {
            let keyValue = line.split('=', 2);
            result[keyValue[0]] = keyValue[1];
        });
        console.log(result);
    });

    test('test.exclude_file', () => {
        let exclude_file = path.resolve(__dirname, '../__test__/exclude_file');

        let files = getExcludesByFile(exclude_file);
        console.log('files', files);
    });

    test('test.exclude_file2', () => {
        let exclude_file = path.resolve(__dirname, '../__test__/exclude_file');
        let baseDir = process.cwd();
        let excludeDir = path.resolve(exclude_file, '..');

        let excludesFiles = getExcludesByFile(exclude_file).map(v => path.join(excludeDir, v));
        let matchesFiles = getMatchesFile(`${baseDir}/**/*`, excludesFiles);
        console.log('files', matchesFiles);
    });

    test('test.env_file', () => {
        let env_file = path.resolve(__dirname, '../__test__/env_file.env');
        let files = getEnvByFile(env_file);
        console.log('files', files);
    });

    test('test.matchdir', () => {
        let exclude_file = path.resolve(__dirname, '../__test__/exclude_file');
        let baseDir = process.cwd();
        let excludeDir = path.resolve(exclude_file, '..');
        let excludesFiles = getExcludesByFile(exclude_file).map(v => path.join(excludeDir, v));
        let list = getMatchesDir(`${baseDir}/**/*`, excludesFiles, ['key1']);
        renameDir(list, {key1: 'value1', key2: 'value2'})
        console.log('list', list);
    });
});
