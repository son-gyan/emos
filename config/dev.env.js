'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL:'"http://52.83.174.110:8779/api"'
  //BASE_URL:'"http://192.168.102.205:8779/api"'
})
