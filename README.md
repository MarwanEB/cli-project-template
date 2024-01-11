# cli-project-template

Opinionated project template to write command line packages in TypeScript 🧑🏼‍💻.

## Dependencies 🔗

To bundle this project you need to install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) (this will allow you to install and use the correct version of Node.js / npm for this project).

## How to use 📖

1. Install the right version of node / npm

```sh
nvm install && nvm use
```

2. Install dependencies

```sh
npm ci
```

You're all set up 🎉 ! You can now run any commands from the `package.json` file like below:

```sh
npm run command:list
```

## Commands 📦

<!-- DO NOT REMOVE: CommandListStart -->

### Table of Contents

[command:create](#commandcreate)
[command:list](#commandlist)

### `command:create`

Creates a new command in the project.

__Usage:__ `cli-project-template command:create [options]`

| Option | Description |
|:----:|:----:|
| `--name <name>` | Command name (formatted as {namespace}:{action}). Ex: project:create, command:delete... |
| `--summary <summary>` | Command short description. |
| `--description <description>` | Command long description. |
| `--dir <targetDir>` | Target directory where the command file will be created. |
| `-h, --help` | display help for command |

### `command:list`

List all commands

__Usage:__ `cli-project-template command:list [options]`

| Option | Description |
|:----:|:----:|
| `-t, --target <target>` | target of where the list will be printed. (default: "cli") |
| `-f, --format <format>` | output the list of commands in a file. (default: "text") |
| `-h, --help` | display help for command |

<!-- DO NOT REMOVE: CommandListEnd -->

## Todo 📝

- [ ] Write git hook to print all commands documentation in `README.md`.
