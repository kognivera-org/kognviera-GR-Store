/* code from vue-nes */

import Nes from 'nes'

const SOCKET_CONNECTED = '@react-hapines/CONNECTED'
const SOCKET_DISCONNECTED = '@react-hapines/DISCONNECTED'
const SOCKET_MESSAGE = '@react-hapines/MESSAGE'

class Socket {
  constructor(store) {
    this.store = store
  }
  connect(url) {
    if (this.client) {
      this.client.disconnect()
    }
    this.client = new Nes.Client(url)
    this.client.connect(() => {
      this.client.onUpdate = (update) => {
        this.store.dispatch({
          type: SOCKET_MESSAGE,
          message: update,
        })
      }
    })
    this.client.onConnect = () => {
      this.store.dispatch({ type: SOCKET_CONNECTED })
    }
    this.client.onDisconnect = () => {
      this.store.dispatch({ type: SOCKET_DISCONNECTED })
    }
    return this // for chaining
  }
}

const initialState = {
  connected: false,
  sequence: -1,
  message: {},
}

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SOCKET_CONNECTED: {
      return {
        ...state,
        connected: true,
      }
    }
    case SOCKET_DISCONNECTED: {
      return {
        ...state,
        connected: true,
      }
    }
    case SOCKET_MESSAGE: {
      const sequence = state.sequence + 1
      return {
        state,
        sequence,
        message: action.message,
      }
    }
    default:
      return state
  }
}

export const connect = (store, url) => new Socket(store).connect(url)
