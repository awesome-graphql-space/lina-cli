/* tslint:disable:no-for-in */

/**
 * Return the write-time plugins.
 */

// tslint:disable-next-line:no-unused
export function read(flake: any) {
  const fns = []

  /**
   * Close opening handlebars blocks in filenames since you can't normally have
   * closing slashes in file names. Kinda leaky.
   */

  fns.push(function (files: any) {
    let matcher = /\{\{[#^] *(\w+) *\}\}/
    // tslint:disable-next-line:forin
    for (let file in files) {
      let m = matcher.exec(file)
      if (!m) continue
      let data = files[file]
      delete files[file]
      file += '{{/' + m[1] + '}}'
      files[file] = data
    }
  })

  return fns
}
