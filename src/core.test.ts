jest.mock('@actions/core');
jest.mock('@actions/github');
jest.mock('fs');

import core from '@actions/core';
import {when} from 'jest-when';
import {run} from './core';

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
        console.log('getInputFn', core);
        await run({
            left_delim: '<<[',
            right_delim: ']>>',
            path: '**/*',
            excludes: undefined,
            overflow_readme_file: undefined,
            env_file: undefined,
            env: 'key=value,key2=value2',
        });
    });
});
