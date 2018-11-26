import Command, {flags} from '@oclif/command'

export default abstract class extends Command {
  static flags = {
    loglevel: flags.string({options: ['error', 'warn', 'info', 'debug']}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  log(msg: string, level: string) {
    switch (level) {
    case 'error':
      // tslint:disable-next-line:no-console
      console.error(msg)
      break
    case 'warn':
      // tslint:disable-next-line:no-console
      console.warn(msg)
      break
    case 'info':
      // tslint:disable-next-line:no-console
      console.info(msg)
      break
    case 'debug':
      // tslint:disable-next-line:no-console
      console.debug(msg)
      break
    case 'log':
      // tslint:disable-next-line:no-console
      console.log(msg)
      break
    default:
      // tslint:disable-next-line:no-console
      console.log(msg)
    }
  }

  // tslint:disable-next-line:no-unused
  async init(err) {
    // do some initialization
    const {flags} = this.parse(this.constructor)
    this.flags = flags
  }
  // tslint:disable-next-line:no-unused
  async catch(err) {
    // handle any error from the command
  }
  // tslint:disable-next-line:no-unused
  async finally(err) {
    // called after run and catch regardless of whether or not the command errored
  }
}
