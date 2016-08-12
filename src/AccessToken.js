/**
 * Local dependencies
 */
const {JWS} = require('?')
const {JSONSchema} = require('json-document')

/**
 * AccessToken Schema
 */
const schema = JWS.schema.extend({
  type: 'object',
  properties: {
    // ...
  }
})

/**
 * AccessToken
 */
class AccessToken extends JWS {

  /**
   * Schema
   */
  static get schema () {
    return schema
  }
}

/**
 * Export
 */
module.exports = AccessToken
