import core from '@actions/core';
import github, {getOctokit} from '@actions/github';
import {
    RepositoryCreatedEvent
} from '@octokit/webhooks-definitions/schema'
import * as fs from "fs";
import * as path from "path";
import {glob} from "glob";


interface Inputs {
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

export async function run() {
    const octokit = getOctokit(process.env.GITHUB_TOKEN!);
    let context = github.context;
    let repository_name = context.payload.repository?.name;
    let repository_full_name = context.payload.repository?.full_name;
    let repository_html_url = context.payload.repository?.html_url;
    let git_ref = context.ref;

    let input = getInput();
    let envFile = input.env_file;
    let leftDelim = input.left_delim;
    let rightDelim = input.right_delim;
    let env = input.env;
    let overflowReadmeFile = input.overflow_readme_file;
    let excludes = (input.excludes ?? '').split(',').map((value) => value.trim());
    let sender;

    if (github.context.eventName === 'created') {
        const payload = github.context.payload as RepositoryCreatedEvent;
        sender = payload.sender;
        payload.repository.master_branch;
    }

    const baseDir = path.resolve(process.cwd());
    let files = glob.sync(`${baseDir}/${input.path}`, {
        nodir: true,
        ignore: excludes.map((value) => path.join(baseDir, value))
    });

    if (overflowReadmeFile && fs.existsSync(overflowReadmeFile)) {
        let data = fs.readFileSync(overflowReadmeFile);
        fs.writeFileSync(data, path.resolve(baseDir, 'README.md'), {flag: 'w'});
    }

    let envObject = {
        repository_name,
        repository_full_name,
        repository_html_url,
        git_ref
    };
    if (envFile) {
        let file = path.resolve(baseDir, envFile);
        if (!fs.existsSync(file)) {
            throw new Error('input [`env_file`] not found');
        }
        let envFileJson = JSON.parse(fs.readFileSync(file) as any) ?? {};
        envObject = {
            ...envObject,
            ...envFileJson
        }
    }
    if (env && env.indexOf('=') > 0) {
        let envJson: any = {};
        env.split(',').map((value) => value?.split('=', 2) ?? [])
            .filter(value => value.length === 2).forEach(value => envJson[value[0]] = value[1]);
        envObject = {
            ...envObject,
            ...envJson
        }
    }
    for (let file of files) {
        templateFile(file, file, leftDelim, rightDelim, envObject);
    }

    let owner = context.repo.owner;
    let repo = context.repo.repo;

    octokit.git.createCommit({
        owner,
        repo,
        message: 'initial',
        tree: context.sha,
        author: {
            name: sender?.name ?? 'github-actions[bot]',
            email: sender?.email ?? 'github-actions[bot]@users.noreply.github.com',
        }
    });

}

let templateFile = (inputFile: string, outputFile: string, leftDelim: string, rightDelim: string, jsonObject: any = {}) => {
    if (!fs.existsSync(inputFile)) {
        return;
    }
    leftDelim = escape(leftDelim);
    rightDelim = escape(rightDelim);

    let keys = Object.keys(jsonObject) ?? [];
    let data = fs.readFileSync(inputFile);

    if (!data) {
        return;
    }
    let txt: string = String(data);

    for (let key of keys) {
        if (!key) return
        let value = jsonObject[key];
        let keyRegex = new RegExp(`${leftDelim}\s${key}\s${rightDelim}`, 'g');
        txt = txt.replace(keyRegex, value);
    }
    fs.writeFileSync(txt, outputFile, {flag: 'w'})
}

let escape = (text: string): string => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
