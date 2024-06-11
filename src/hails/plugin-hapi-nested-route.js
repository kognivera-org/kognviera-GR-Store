'use strict';

const register = async (server, options) => {
    const origRoute = server.root.route
    console.log('origRoute', origRoute)
    const makeRoutes = (prefix = '') => {
      const methods = ['get', 'post', 'put', 'del', 'any']
      const innerRoute = (routeOptions) => {
        routeOptions.path = `${prefix}${routeOptions.path}`
        origRoute.apply(server, [routeOptions])
      }
  
      Object.keys(origRoute).forEach((k) => {
        innerRoute[k] = origRoute[k];
      });
  
      methods.forEach((hm) => {
        let method = hm.toUpperCase()
        if (hm === 'any') method = '*'
        if (hm === 'del') method = 'delete' 
        innerRoute[hm] = (path, config, handler) => {
          return origRoute.apply(server.root, [{
            path: `${prefix}${path}`,
            method,
            handler,
            config,
          }])
        }
      })
      innerRoute.nested = (prefixNested) => makeRoutes(prefix + prefixNested)
      return innerRoute
    }     
    server.root.route = makeRoutes()
  }
  
  register.attributes = {
    name: 'hapi-nested-route',
  }
  
  module.exports = {
    register,
    name: 'hapi-nested-route',
    version: '1.0.0',
  }
  
  