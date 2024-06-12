import * as Hapi from '@hapi/hapi'
import * as Hoek from '@hapi/hoek'
import { getSettings } from './settings'
import settingsFile from '../../settings';

const settingsdd = settingsFile[process.env.NODE_ENV];

const settings = getSettings();
function makeDefaultOptions() {
    return Hoek.applyToDefaults(settingsdd.connection, {
      routes: {
        json: {
          space: 2,
        },
      }
    })
}

export const server = Hapi.server(makeDefaultOptions());