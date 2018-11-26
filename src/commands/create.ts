import Command, {flags} from '@oclif/command'
import * as download from 'download-git-repo'
import {existsSync as exists} from 'fs'
import * as inquirer from 'inquirer'
import * as path from 'path'
import metadata from 'read-metadata'
import {sync as rm} from 'rimraf'
import * as uid from 'uid'

import {TEMPLATE_REPO} from '../constants'
import Flake from '../lib'

const metadatas = [
  'flake.json',
  'flake.yaml',
  'flake.yml'
]

function options(dir: string) {
  const file = metadatas.map(function (file) { return path.join(dir, file) }).filter(exists)[0]

  if (!file) return {}
  return metadata.sync(file)
}

async function generate(src: string, dest: string, answer: object, fn: any) {
  let opts = options(src)
  let template = path.join(src, opts.template || 'template')
  let flake = new Flake(template)

  if (opts.schema) flake.schema(opts.schema)
  if (opts.order) flake.order(opts.order)

  let main = path.join(src, 'index.js')
  if (exists(main)) require(main)(flake)

  await flake.generate(dest, answer, fn)
}

export default class Create extends Command {
  static description = 'Create new linaframework project'

  static examples = [
    '$ lina create my-app',
  ]

  static args = [
    {
      name: 'name',
      required: true,
      description: 'Please provide a name for your app',
    }
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    // tslint:disable-next-line:no-this-assignment
    const self = this
    const {args} = this.parse(Create)
    const to = path.resolve(args.name)

    if (exists(to)) this.log(`${args.name} already exists`)

      // just prompt for input
    const firstResponses = await inquirer.prompt([
      {
        name: 'name',
        message: 'Project name',
        default: args.name
      },
      {
        name: 'description',
        message: 'Description of your project'
      },
      {
        name: 'author',
        message: 'Name of author'
      },
      {
        name: 'repository',
        message: 'Project repository url'
      },
      {
        name: 'size',
        message: 'Project size to help allocate some features',
        type: 'list',
        choices: [{name: 'small'}, {name: 'medium'}, {name: 'enterprise'}],
      },
      {
        name: 'features',
        message: 'select features/modules to speed up your project',
        type: 'checkbox',
        choices: [{name: 'authentication'}, {name: 'chat'}, {name: 'social'}, {name: 'push-notification'}],
      },
      {
        name: 'databaseType',
        message: 'select a database type',
        type: 'list',
        choices: [{name: 'NoSQL'}, {name: 'SQL'}, {name: 'Graph'}],
      },
      {
        name: 'confirm',
        message: 'You are sure of the options selected?',
        type: 'confirm',
      },
    ])

    const template = `direct:${TEMPLATE_REPO}`

    let tmp = '/tmp/flake-' + uid()

    try {
      if (args.name) {
        await download(template, tmp, async (err: any) => {
          if (err) self.log(err)
          await generate(tmp, to, firstResponses, function (err: any) {
            rm(tmp)
            if (err) self.log(err)
            self.log(`Generated ${name}`)
          })
        })
      } else {
        this.log('There was an error downloading the template', 'error')
      }
    } catch (error) {
      this.log(error)
    }

    this.log(`You entered: ${firstResponses.name}, ${firstResponses.description}, ${firstResponses.databaseType}`)
  }
}
