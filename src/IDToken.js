/**
 * Local dependencies
 */
const {JWS} = require('?')

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
