/**
 * Dependencies
 */
const {JSONSchema, JSONDocument} = require('json-document')
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
 *      popup: { width: 400, height: 300 },
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
 *    store: localStorage || req.session
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
   * Constructor
   */
  constructor (options = {}) {
    super()
    if (!options.issuer) {
      throw new Error('RelyingParty must have an issuer')
    }
    this.issuer = options.issuer
    this.client_id = options.client_id
    this.persistence = options.persistence || RelyingParty.defaultStore()
  }

  /**
   * fromProvider
   *
   * @description
   * Promises a RelyingParty instance with discovery and JWK Set
   * data.
   *
   * @param {Object} options
   * @returns Promise
   */
  static fromProvider (options) {
    let client = new RelyingParty(options)

    return Promise.all([
      client.discover(),
      client.keys()
    ]).then(() => client)
  }

  /**
   * Schema
   */
  static get schema () {
    return RelyingPartySchema
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
        .then(status(200))
        .then(response => {
          return this.provider.configuration = response.json()
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
  register () {
    try {
      let configuration = this.provider.configuration

      assert(configuration, 'OpenID Configuration is not initialized.')
      assert(configuration.registration_endpoint, 'OpenID Configuration is missing registration_endpoint.')

      let uri = configuration.registration_endpoint
      let method = 'post'
      let headers = new Headers({ 'Content-Type': 'application/json' })
      let params = this.params.register
      let body = JSON.stringify(Object.assign({}, params, options))

      return fetch(uri, {method, headers, body})
        .then(status)
        .then(response => {
          return response.json()
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
        .then(status(200))
        .then(response => {
          return this.provider.jwks = response.json()
        })

    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * Authenticate
   *
   * @description
   * Initiates OpenID Connect implicit authentication flow by, directing the
   * User-Agent to the issuer's authorize endpoint, either by changing the
   * window location or by opening a popup window.
   *
   * @param {Object} options
   * @returns Promise
   */
  authenticate (options) {
    return AuthenticationRequest.send(this)
  }

  /**
   * Authenticate URI
   *
   * @description
   * Constructs a URI that can be employed in a hyperlink to initiate an
   * authentication flow with the configured OpenID Connect provider (issuer)..
   *
   * @param {Object} options
   * @returns string
   */
  authenticateUri (options) {
    let request = new AuthenticationRequest(this)
    return request.uri(options)
  }

  /**
   * Validate Response
   */
  validateResponse (uri) {
    AuthenticationResponse.validate(uri)
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
   * Is Authenticated
   */
  isAuthenticated () {}

  /**
   * Logout
   */
  logout () {}
}

module.exports = RelyingParty
