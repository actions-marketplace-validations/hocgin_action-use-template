import * as path from "path";

jest.mock('@actions/core');
jest.mock('@actions/github');
jest.mock('fs');

import * as core from '@actions/core';
import {when} from 'jest-when';
import {getEnvByFile, getExcludesByFile, run} from './core';
import * as fs from "fs";

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

    test('test.exclude_file', async () => {
        let files = getExcludesByFile('/Users/hocgin/Projects/action-use-template/__test__/exclude_file');
        console.log('files', files);
    });
});
