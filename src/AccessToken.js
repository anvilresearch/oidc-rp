/**
 * Local dependencies
 */
const {JWT} = require('@trust/jose')
const AccessTokenSchema = require('./AccessTokenSchema')

/**
 * AccessToken
 */
class AccessToken extends JWT {

  /**
   * Schema
   */
  static get schema () {
    return AccessTokenSchema
  }
}

/**
 * Export
 */
module.exports = AccessToken
