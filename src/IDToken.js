/**
 * Local dependencies
 */
const {JWS} = require('?')
const {JSONSchema} = require('json-document')

/**
 * IDToken Schema
 */
const schema = JWS.schema.extend({
  type: 'object',
  properties: {
    // ...
  }
})

/**
 * IDToken
 */
class IDToken extends JWS {

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
module.exports = IDToken
