/* tslint:disable:no-for-in */
import * as handlebars from 'handlebars'
import {extend} from 'lodash'
import * as templates from 'metalsmith-templates'

/**
 * Return the write-time plugins.
 */

export function write(flake: any) {
  let fns = []

  /**
   * Template the file names.
   */

  fns.push(function (files: any, metalsmith: any) {
    let metadata = metalsmith.metadata()
    let filenames = extend({}, files)
    // tslint:disable-next-line:forin
    for (let file in filenames) {
      let data = files[file]
      let fn = handlebars.compile(file)
      let clone = extend({}, data, metadata)
      let str = fn(clone)
      let i = file.indexOf('{{')
      delete files[file]
      if (str === file.slice(0, i)) continue
      files[str] = data
    }
  })

  /**
   * Template the file contents.
   */

  fns.push(templates({
    engine: 'handlebars',
    helpers: flake.helpers(),
    inPlace: true,
    pattern: '!*.hbs'
  }))

  /**
   * Return.
   */

  return fns
}
