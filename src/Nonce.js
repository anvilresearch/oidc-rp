/**
 * Dependencies
 */
const crypto = require('webcrypto')

/**
 * Nonce
 */
class Nonce {

  /**
   * generate
   *
   * @description
   * Generate a base64url encoded SHA-256 hashed random nonce of a given length.
   *
   * @param {Number} nonce
   * @returns {Promise}
   */
  static generate (length) {
    let random = crypto.getRandomValues(new Uint32Array(length))
    return crypto.subtle.digest('SHA-256', random).then(hash => base64url(hex(hash)))
  }

  /**
   * verify
   */
  verify () {}
}

/**
 * Export
 */
module.exports = Nonce
