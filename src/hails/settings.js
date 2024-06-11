import * as Path from 'path'
import * as Hoek from '@hapi/hoek'
import * as Fs from 'fs'

const guide = (environment) => {
  return `There is no settings object, the minimal settings are below.\n
    module.exports = {
      ${environment}: {}
    }`
}

export const path = process.env.SETTINGS
  ? Path.resolve(process.env.SETTINGS)
  : Path.resolve(process.cwd(), 'settings.js')

// default option + settings.js
export const getSettings = () => {
  const environment = process.env.NODE_ENV || 'development'
  try {
    Fs.statSync(path)
    const userSettings = require(path)[environment]
    if (!userSettings) {
      console.error(`
--[ hails error ]--

settings file location: ${path}
${guide(environment)}
`)
      process.exit(-1)
    }

    const defaults = Hoek.applyToDefaults(
      require('./default').default,
      require(path)[process.env.NODE_ENV || 'development']
    )

    return defaults;
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(`
--[ hails error ]--

settings file location: ${path}
no settings file

${guide(environment)}
`)
      process.exit(-2)
    }
    console.error(e)
    process.exit(-3)
  }
}