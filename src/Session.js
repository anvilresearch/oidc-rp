'use strict'

class Session {
  /**
   * @param options {Object}
   *
   * @param options.issuer {string} Identity provider (issuer of ID/Access Token)
   *
   * @param options.authorization {object}
   * @param options.authorization.client_id {string} OIDC/OAuth2 client id
   * @param [options.authorization.id_token] {string} Compact-serialized id_token param
   * @param [options.authorization.access_token] {string} Compact-serialized access_token param
   * @param [options.authorization.refresh_token] {string} Compact-serialized refresh_token
   *
   * @param [options.sessionKey] {string} Serialized client session key generated
   *   during the Authentication Request, used to issue PoPTokens
   *
   * @param [options.idClaims] {object} Decoded/verified ID Token JWT payload
   *
   * @param [options.accessClaims] {object} Decoded/verified Access Token JWT payload
   */
  constructor (options) {
    this.issuer = options.issuer

    this.authorization = options.authorization || {}

    this.sessionKey = options.sessionKey

    this.idClaims = options.idClaims
    this.accessClaims = options.accessClaims

    this.fetch = this.authenticatedFetch()
  }

  /**
   * @param response {AuthenticationResponse}
   *
   * @returns {Session}
   */
  static fromAuthResponse (response) {
    const RelyingParty = require('./RelyingParty')  // import here due to circular dep

    let payload = response.decoded.payload
    let registration = response.rp.registration
    let sessionKey = response.session[RelyingParty.SESSION_PRIVATE_KEY]

    let options = {
      sessionKey,
      issuer: payload.iss,
      authorization: {
        client_id: registration['client_id'],
        access_token: response.params['access_token'],
        id_token: response.params['id_token'],
        refresh_token: response.params['refresh_token']
      },
      idClaims: response.decoded && response.decoded.payload,
    }

    return new Session(options)
  }

  authenticatedFetch () {
    return require('node-fetch')
  }
}

module.exports = Session
