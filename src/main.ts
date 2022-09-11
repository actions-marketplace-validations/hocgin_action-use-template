import {run} from "./core";
import * as core from "@actions/core";

export interface Inputs {
    path: string;
    left_delim: string;
    right_delim: string;
    exclude?: string;
    exclude_file?: string;
    overflow_readme_file?: string;
    env_file?: string;
    env?: string;
}

let getInput = (): Inputs => ({
    left_delim: core.getInput('left_delim'),
    right_delim: core.getInput('right_delim'),
    path: core.getInput('path'),
    exclude: core.getInput('exclude'),
    exclude_file: core.getInput('exclude_file'),
    overflow_readme_file: core.getInput('overflow_readme_file'),
    env_file: core.getInput('env_file'),
    env: core.getInput('env'),
})

try {
    run(getInput())
} catch (error: any) {
    core.setFailed(error?.message);
}
