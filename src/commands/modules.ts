import {flags} from '@oclif/command'
import * as inquirer from 'inquirer'

import Command from '../base'

export default class Modules extends Command {
  static description = 'Create or add existing lina modules'

  static examples = [
    '$ lina module --add',
    '$ lina module --create',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [
    {
      name: 'name',
      required: true,
      description: 'Please provide a name for your app',
    }
  ]

  async run() {
    const {args} = this.parse(Modules)

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

    this.log(`You entered: ${firstResponses.name}, ${firstResponses.description}, ${firstResponses.databaseType}`)
  }
}
