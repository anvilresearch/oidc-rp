/**
 * Dependencies
 */
const assert = require('assert')
const fetch = require('node-fetch')
const {Request, Headers} = fetch
const {JSONSchema, JSONDocument} = require('json-document')
const {JWKSet} = require('jose')
const AuthenticationRequest = require('./AuthenticationRequest')
const AuthenticationResponse = require('./AuthenticationResponse')
const RelyingPartySchema = require('./RelyingPartySchema')
// const Session = require('./Session')

/**
 * RelyingParty
 *
 * @class
 * Client interface for OpenID Connect Relying Party.
 *
 * @example
 *  let client = RelyingParty({
 *    provider: {
 *      name: 'Anvil Research, Inc.',
 *      url: 'https://forge.anvil.io'
 *      // configuration
 *      // jwks
 *    },
 *    authenticate: {
 *      response_type: 'code',
 *      display: 'popup',
 *      scope: 'openid profile email'
 *    },
 *    register: {
 *      client_name: 'Example',
 *      client_uri: 'https://example.com',
 *      logo_uri: 'https://example.com/assets/logo.png',
 *      redirect_uris: ['https://app.example.com/callback'],
 *      response_types: ['code', 'code id_token token'],
 *      grant_types: ['authorization_code'],
 *      default_max_age: 7200,
 *      post_logout_redirect_uris: ['https://app.example.com']
 *    },
 *    registration: {
 *      // if you have it saved somewhere
 *    },
 *    store: localStorage || req.session,
 *    popup: { width: 400, height: 300 }
 *  })
 *
 *  client.discover() => Promise
 *  client.jwks() => Promise
 *  client.authenticate()
 *  client.authenticateUri()
 *  client.validateResponse(uri) => Promise
 *  client.userinfo() => Promise
 *  client.logout()
 */
class RelyingParty extends JSONDocument {

  /**
   * Schema
   */
  static get schema () {
    return RelyingPartySchema
  }

  /**
   * from
   *
   * @description
   * Create a RelyingParty instance from a previously registered client.
   *
   * @param {Object} data
   * @returns Promise
   */
  static from (data) {
    let rp = new RelyingParty(data)
    let validation = rp.validate()

    // schema validation
    if (!validation.valid) {
      return Promise.reject(validation)
    }

    let jwks = rp.provider.jwks

    // request the JWK Set if missing
    if (!jwks) {
      return rp.jwks().then(() => rp)
    }

    // otherwise import the JWK Set to webcrypto
    return JWKSet.importKeys(jwks).then(jwks => {
      rp.provider.jwks = jwks
      return rp
    })
  }

  /**
   * register
   */
  static register (issuer, registration, options) {
    let rp = new RelyingParty({
      provider: { url: issuer },
      defaults: Object.assign({}, options.defaults),
      store: options.store
    })

    return Promise.resolve()
      .then(() => rp.discover())
      .then(() => rp.jwks())
      .then(() => rp.register(registration))
      .then(() => rp)
  }

  /**
   * Discover
   *
   * @description Promises the issuer's OpenID Configuration.
   * @returns {Promise}
   */
  discover () {
    try {
      let issuer = this.provider.url
      let endpoint = '.well-known/openid-configuration'

      assert(issuer, 'OpenID Provider configuration must include issuer')

      return fetch(`${issuer}/${endpoint}`)
        //.then(status(200))
        .then(response => {
          return response.json().then(json => this.provider.configuration = json)
        })

    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Register
   *
   * @description Register's a client with provider as a Relying Party
   * @returns {Promise}
   */
  register (options) {
    try {
      let configuration = this.provider.configuration

      assert(configuration, 'OpenID Configuration is not initialized.')
      assert(configuration.registration_endpoint, 'OpenID Configuration is missing registration_endpoint.')

      let uri = configuration.registration_endpoint
      let method = 'post'
      let headers = new Headers({ 'Content-Type': 'application/json' })
      let params = this.defaults.register
      let body = JSON.stringify(Object.assign({}, params, options))

      return fetch(uri, {method, headers, body})
        //.then(status)
        .then(response => {
          return response.json().then(json => this.registration = json)
        })

    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * jwks
   *
   * @description Promises the issuer's JWK Set.
   * @returns {Promise}
   */
  jwks () {
    try {
      let configuration = this.provider.configuration

      assert(configuration, 'OpenID Configuration is not initialized.')
      assert(configuration.jwks_uri, 'OpenID Configuration is missing jwks_uri.')

      let uri = configuration.jwks_uri

      return fetch(uri)
        //.then(status(200))
        .then(response => {
          return response
            .json()
            .then(json => JWKSet.importKeys(json))
            .then(jwks => this.provider.jwks = jwks)
        })

    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * createRequest
   */
  createRequest (options, session) {
    return AuthenticationRequest.create(this, options, session || this.store)
  }

  /**
   * Validate Response
   */
  validateResponse (response, session) {
    session = session || this.store

    if (response.match(/^http(s?):\/\//)) {
      response = { rp: this, redirect: response, session }
    } else {
      response = { rp: this, body: response, session }
    }

    return AuthenticationResponse
      .validateResponse(response)
  }

  /**
   * userinfo
   *
   * @description Promises the authenticated user's claims.
   * @returns {Promise}
   */
  userinfo () {
    try {
      let configuration = this.provider.configuration

      assert(configuration, 'OpenID Configuration is not initialized.')
      assert(configuration.registration_endpoint, 'OpenID Configuration is missing registration_endpoint.')

      let uri = configuration.userinfo_endpoint
      let access_token = this.session.access_token

      assert(access_token, 'Missing access token.')

      let headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      })

      return fetch(uri, {headers})
        .then(status(200))
        .then(response => {
          return response.json()
        })

    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Logout
   */
  logout () {}
}

module.exports = RelyingParty
