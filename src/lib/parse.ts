import * as handlebars from 'handlebars'

export function parse(string: string) {
  const ast: any = handlebars.parse(string).statements
  let ret: any = {}

  ast.forEach((element: any) => {
    switch (element.type) {
    case 'mustache':
      if (element.params.length) {
        element.params.array.forEach((_: any) => {
            // tslint:disable-next-line:binary-expression-operand-order
          if ('ID' === _.type) ret[_.string] = {type: 'string'}
        })
      } else {
        const key = element.sexpr.id.string
        ret[key] = {type: 'string'}
      }
      break
    case 'block':
      const key = element.mustache.sexpr.id.string
      if (ret[key]) return
      ret[key] = {type: 'boolean'}
    }
  })
}
