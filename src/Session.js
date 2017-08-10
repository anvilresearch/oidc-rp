'use strict'

class Session {
  /**
   * @param options {Object}
   *
   * @param options.idp {string} Identity provider (issuer of ID Token)
   *
   * @param options.clientId {string} Relying Party client_id
   *
   * @param options.sessionKey {string} Serialized client session key generated
   *   during the Authentication Request, used to issue PoPTokens
   *
   * @param options.decoded {IDToken} Decoded/verified ID Token JWT
   *
   * @param options.accessToken {string} Compact-serialized access_token param
   *
   * @param options.idToken {string} Compact-serialized id_token param
   */
  constructor (options) {
    this.idp = options.idp
    this.clientId = options.clientId
    this.sessionKey = options.sessionKey
    this.decoded = options.decoded

    // Raw (string-encoded) tokens
    this.accessToken = options.accessToken
    this.idToken = options.idToken
  }

  /**
   * @param response {AuthenticationResponse}
   *
   * @returns {Session}
   */
  static fromAuthResponse (response) {
    const RelyingParty = require('./RelyingParty')  // import here due to circular dep

    const payload = response.decoded.payload
    const registration = response.rp.registration
    const sessionKey = response.rp.store[RelyingParty.SESSION_PRIVATE_KEY]

    let options = {
      sessionKey,
      idp: payload.iss,
      clientId: registration['client_id'],
      decoded: response.decoded,
      accessToken: response.params['access_token'],
      idToken: response.params['id_token']
    }

    return new Session(options)
  }
}

module.exports = Session
