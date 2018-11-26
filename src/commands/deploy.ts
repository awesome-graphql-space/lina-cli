import {flags} from '@oclif/command'
import * as inquirer from 'inquirer'

import Command from '../base'

export default class Deploy extends Command {
  static description = 'Deploy project to cloud'

  static examples = [
    '$ lina deploy',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [
  ]

  async run() {
    // just prompt for input
    const firstResponses = await inquirer.prompt([
      {
        name: 'type',
        message: 'Select deployment option',
        type: 'list',
        choices: [{name: 'Docker'}, {name: 'Heroku'}, {name: 'Virtual Machine'}],
      },
    ])

    this.log(`You entered: ${firstResponses.type}`)
  }
}
