'use strict'

const fetch = require('node-fetch')
const onHttpError = require('./onHttpError')
const PoPToken = require('./PoPToken')

class Session {
  /**
   * @param options {Object}
   *
   * @param options.credentialType {string} 'access_token' or 'pop_token'
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
    this.credentialType = options.credentialType || 'access_token'

    this.issuer = options.issuer

    this.authorization = options.authorization || {}

    this.sessionKey = options.sessionKey

    this.idClaims = options.idClaims
    this.accessClaims = options.accessClaims

    this.fetch = this.authenticatedFetch()
  }

  static from (options) {
    return new Session(options)
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
    let rpAuthOptions = response.rp.authenticate || {}

    let sessionKey = response.session[RelyingParty.SESSION_PRIVATE_KEY]

    let options = {
      sessionKey,
      issuer: payload.iss,
      credentialType: rpAuthOptions['credential_type'],
      authorization: {
        client_id: registration['client_id'],
        access_token: response.params['access_token'],
        id_token: response.params['id_token'],
        refresh_token: response.params['refresh_token']
      },
      idClaims: response.decoded && response.decoded.payload,
    }

    return Session.from(options)
  }

  /**
   * authenticatedFetch
   *
   * @returns {function}
   */
  authenticatedFetch () {
    /**
     * fetch() function signature
     *
     * @param url {RequestInfo|string}
     * @param options {object}
     *
     * @returns {Promise<Response>}
     */
    return (url, options) => {
      return fetch(url, options)

        .then(response => {
          if (response.status === 401 && this.hasCredentials()) {
            // Retry with credentials
            return this.fetchWithCredentials(url, options)
          }

          if (!response.ok) {
            onHttpError()(response)  // throw error
          }

          return response
        })
    }
  }

  /**
   * bearerTokenFor
   *
   * @param url {string}
   *
   * @returns {Promise<string>}
   */
  bearerTokenFor (url) {
    switch (this.credentialType) {
      case 'pop_token':
        return PoPToken.issueFor(url, this)

      default:  // 'access_token' etc
        return Promise.resolve(this.authorization[this.credentialType])
    }
  }

  /**
   * hasCredentials
   *
   * @returns {boolean}
   */
  hasCredentials () {
    switch (this.credentialType) {
      case 'pop_token':
        return !!this.authorization['id_token']

      default:  // 'access_token' etc
        return !!this.authorization[this.credentialType]
    }
  }

  /**
   * fetchWithCredentials
   *
   * @param url {RequestInfo|string}
   * @param options {object}
   *
   * @returns {Promise<Response>}
   */
  fetchWithCredentials (url, options) {
    options.headers = options.headers || {}

    return this.bearerTokenFor(url)

      .then(token => {
        options.headers.authorization = `Bearer ${token}`

        return fetch(url, options)
      })
  }

  toJSON () {
    return JSON.stringify(this)
  }
}

module.exports = Session
