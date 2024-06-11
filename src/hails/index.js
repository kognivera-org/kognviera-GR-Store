import * as Hapi from '@hapi/hapi'
import * as Hoek from '@hapi/hoek'
import { getSettings } from './settings'

const settings = getSettings();

function makeDefaultOptions() {
    return Hoek.applyToDefaults(settings.server, {
      routes: {
        json: {
          space: 2,
        },
      }
    })
}

export const server = Hapi.server(makeDefaultOptions());