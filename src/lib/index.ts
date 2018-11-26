/* tslint:disable:no-for-in */
import * as assert from 'assert'
import * as fs from 'co-fs-extra'
import * as deep from 'deep-extend'
import * as is from 'is'
import * as utf8 from 'is-utf8'
import * as lodash from 'lodash'
import * as Metalsmith from 'metalsmith'
import * as path from 'path'
import * as prompt from 'prompt-for'
import * as sort from 'sort-object'
import * as thunkify from 'thunkify'
import * as uid from 'uid'

import * as helpers from './helpers'
import {parse} from './parse'
import * as plugins from './plugins'

/**
 * Convenience.
 */

let basename = path.basename
let cp = fs.copy
let dirname = path.dirname
let exists = fs.exists
let extend = lodash.extend
let extname = path.extname
let join = path.join
let mkdir = fs.mkdirs
let omit = lodash.omit
let resolve = path.resolve
let rm = fs.remove
let stat = fs.stat

/**
 * Thunks.
 */

const newPrompt = thunkify(prompt)

let automatic = ['date', 'basename']

/**
 * Initialize a new `Flake` instance.
 */

export default class Flake {
  [x: string]: any;
  template: string
  metalsmith: any

  constructor(template: any) {
    if (!(this instanceof Flake)) return new Flake(template)
    assert(is.string(template), 'You must pass a template path string.')
    this.template = resolve(template)
    this.helpers(helpers)
    this.metalsmith = new Metalsmith('/').frontmatter(false)
  }

  /**
   * Add a plugin `fn` to run before writing the files to disk.
   */
  before(fn: any) {
    if (!arguments.length) return this._before || []
    assert(is.fn(fn), 'You must pass a plugin function.')
    this._before = this._before || []
    this._before.push(fn)
    return this
  }

/**
 * Add a plugin `fn` to run after writing the files to disk.
 */

  after(fn: any) {
    if (!arguments.length) return this._after || []
    assert(is.fn(fn), 'You must pass a plugin function.')
    this._after = this._after || []
    this._after.push(fn)
    return this
  }

  /**
   * Get or set the newPrompt `format` settings.
   */
  format(format: any) {
    if (!arguments.length) return this._format || {}
    assert(is.object(format), 'You must pass a formatting settings object.')
    this._format = format
    return this
  }

/**
 * Get or set additional `schema` information.
 */

  schema(schema: any) {
    if (!arguments.length) return this._schema || {}
    assert(is.object(schema), 'You must pass a schema object.')
    this._schema = schema
    return this
  }

/**
 * Get or set the `order` for the newPrompts.
 */

  order(order: any = null) {
    if (!arguments.length) return this._order || []
    assert(is.array(order), 'You must pass an order array.')
    this._order = order
    return this
  }

/**
 * Add additional handlebars `helpers`.
 */

  helpers(helpers: any) {
    if (!arguments.length) return this._helpers
    assert(is.object(helpers), 'You must pass an helpers object.')
    this._helpers = this._helpers || {}
    extend(this._helpers, helpers)
    return this
  }

/**
 * Read the template with Metalsmith.
 */

  // tslint:disable-next-line:member-ordering
  // tslint:disable-next-line:member-ordering
  *read() {
    let tmpl = this.template
    let dir = yield isDirectory(tmpl)

    let tmp

    if (!dir) {
      tmp = temp()
      yield mkdir(tmp)
      yield cp(tmpl, join(tmp, tmpl))
      tmpl = join(tmp, dirname(tmpl))
    }

    let files = yield this.metalsmith.read(tmpl)
    yield this.metalsmith.run(files, plugins.read(this))

    if (!dir) yield rm(tmp)
    return files
  }

  /**
   * Parse a schema from a set of `files`.
   */
  parse(files: any) {
    assert(is.object(files), 'You must pass a files object.')
    let ret = {}

    // tslint:disable-next-line:forin
    for (let key in files) {
      let file = files[key]
      if (!utf8(file.contents)) continue
      extend(ret, parse(key))
      // tslint:disable-next-line:binary-expression-operand-order
      if ('.hbs' === extname(key)) continue
      extend(ret, parse(file.contents.toString()))
    }

    ret = omit(ret, automatic)
    ret = deep(ret, this.schema(null))
    ret = sort(ret, {sort: sorter(this.order())})
    return ret
  }

  /**
   * newPrompt for a given `schema`.
   */

  *newPrompt(schema: any) {
    assert(is.object(schema), 'You must pass a schema object.')
    let answers = yield newPrompt(schema, this.format(null))
    return answers
  }

  /**
   * Write a Metalsmith `files` object to a directory.
   */
  *write(destination: any, files: any, answers: any, fn: any) {
    answers = answers || {}

    console.log('====================================')
    console.log(files)
    console.log('====================================')
    assert(is.string(destination), 'You must pass a destination path.')
    assert(is.object(files), 'You must pass a files object.')
    assert(is.object(answers), 'You must pass an answers object.')

    let tmpl = this.template
    let dir = yield isDirectory(tmpl)
    let dest = destination

    answers.date = new Date()
    answers.basename = basename(destination)

    this.metalsmith.metadata(answers)
    yield this.metalsmith.run(files, this.before(fn))
    yield this.metalsmith.run(files, plugins.write(this))

    if (!dir) {
      let tmp = temp()
      yield mkdir(tmp)
      dest = tmp
    }

    yield this.metalsmith.write(files, dest)

    if (!dir) {
      let file = Object.keys(files)[0]
      yield cp(join(dest, file), destination)
      yield rm(dest)
    }

    yield this.metalsmith.run(files, this.after(fn))
  }

  /**
   * Read the template, optionally newPrompting for `answers`, and then write to a
   * `dest` path.
   */
  *generate(destination: any, answers: any, fn: any) {
    assert(is.string(destination), 'You must pass a destination path to generate to.')
    let files = yield this.read()

    if (!answers) {
      let schema = yield this.parse(files)=
      answers = yield this.newPrompt(schema)
    }
    assert(is.object(answers), 'The answers must be an object.')
    yield this.write(destination, files, answers, fn)
  }

}

/**
 * Check whether a `path` is a directory.
 */

function *isDirectory(dir: any) {
  let stats = yield stat(dir)
  return stats.isDirectory()
}

/**
 * Return a temporary directory path.
 */

function temp() {
  return '/tmp/Flake-' + uid()
}

function sorter(order: any) {
  order = order || []
  return function (a: any, b: any) {
    let i = order.indexOf(a)
    let j = order.indexOf(b)
    // tslint:disable-next-line:no-bitwise
    if (~i && !~j) return -1
    // tslint:disable-next-line:no-bitwise
    if (~j && !~i) return 1
    if (i < j) return -1
    if (j < i) return 1
    return 0
  }
}
