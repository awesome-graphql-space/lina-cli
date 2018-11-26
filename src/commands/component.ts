import {flags} from '@oclif/command'
import * as inquirer from 'inquirer'

import Command from '../base'

export default class Component extends Command {
  static description = 'create a new lina component'

  static examples = [
    '$ lina component',
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
      name: 'new',
      required: true,
      description: 'Create a lina service',
    }
  ]

  async run() {
    // just prompt for input
    const firstResponses = await inquirer.prompt([
      {
        name: 'type',
        message: 'Select type of component you want to create',
        type: 'list',
        choices: [{name: 'service'}, {name: 'type'}, {name: 'module'}],
      },
    ])

    this.log(`You entered: ${firstResponses.type}`)
  }
}
