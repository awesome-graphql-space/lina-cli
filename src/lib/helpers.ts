import * as moment from 'moment'
import * as Case from 'to-case'

/**
 * Cases.
 */

Object.keys(Case.cases).forEach(function (key) {
  exports[key + 'case'] = function (str: any) {
    return Case[key](str)
  }
})

/**
 * Default.
 */

exports.default = function (value: any, def: any) {
  return value ? value : def
}

/**
 * Date.
 */

exports.date = function (date: any, format: any) {
  return moment(date).format(format)
}

/**
 * Is and isnt.
 */

exports.is = function (value: any, match: any) {
  return value === match
}

exports.isnt = function (value: any, match: any) {
  return value !== match
}
