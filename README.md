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

TODO

## Todo 📝

- [x] Documentation
- [ ] Write git hook to print all commands documentation in `README.md`.
- [ ] Write git hook to add a new entry in npm scripts for each new command that is added.
