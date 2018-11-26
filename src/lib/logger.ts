/* tslint:disable:no-console */
import chalk from 'chalk'
import {format} from 'util'

const prefix = 'lina'
const sep = chalk.gray(' . ')

export function log() {
  let msg = format.apply(format, arguments)
  console.log(chalk.white(prefix), sep, msg)
}

export function fatal(message: any) {
  if (message instanceof Error) message = message.message.trim()
  let msg = format.apply(format, arguments)
  console.error(chalk.red(prefix), sep, msg)
  process.exit(1)
}

export function success() {
  let msg = format.apply(format, arguments)
  console.log(chalk.white(prefix), sep, msg)
  process.exit(0)
}
