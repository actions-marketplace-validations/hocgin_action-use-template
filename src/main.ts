import {run} from "./core";
import * as core from "@actions/core";

export interface Inputs {
    path: string;
    left_delim: string;
    right_delim: string;
    excludes?: string;
    overflow_readme_file?: string;
    env_file?: string;
    env?: string;
}

let getInput = (): Inputs => ({
    left_delim: core.getInput('left_delim'),
    right_delim: core.getInput('right_delim'),
    path: core.getInput('path'),
    excludes: core.getInput('excludes'),
    overflow_readme_file: core.getInput('overflow_readme_file'),
    env_file: core.getInput('env_file'),
    env: core.getInput('env'),
})

run(getInput());
