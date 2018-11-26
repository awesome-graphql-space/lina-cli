lina-cli
========

lina-cli is the official scaffolding cli for lina framework

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/lina-cli.svg)](https://npmjs.org/package/lina-cli)
[![CircleCI](https://circleci.com/gh/awesome-graphql-space/lina-cli/tree/master.svg?style=shield)](https://circleci.com/gh/awesome-graphql-space/lina-cli/tree/master)
[![Codecov](https://codecov.io/gh/awesome-graphql-space/lina-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/awesome-graphql-space/lina-cli)
[![Downloads/week](https://img.shields.io/npm/dw/lina-cli.svg)](https://npmjs.org/package/lina-cli)
[![License](https://img.shields.io/npm/l/lina-cli.svg)](https://github.com/awesome-graphql-space/lina-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lina-cli
$ lina COMMAND
running command...
$ lina (-v|--version|version)
lina-cli/0.0.1 darwin-x64 node-v11.1.0
$ lina --help [COMMAND]
USAGE
  $ lina COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lina hello [FILE]`](#lina-hello-file)
* [`lina help [COMMAND]`](#lina-help-command)

## `lina hello [FILE]`

describe the command here

```
USAGE
  $ lina hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ lina hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/awesome-graphql-space/lina-cli/blob/v0.0.1/src/commands/hello.ts)_

## `lina help [COMMAND]`

display help for lina

```
USAGE
  $ lina help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->
