/**
 * Dependencies
 */
const {JSONSchema, JSONDocument} = require('json-document')
const AuthenticationRequest = require('./AuthenticationRequest')
const AuthenticationResponse = require('./AuthenticationResponse')
// const Session = require('./Session')

/**
 * RelyingParty Schema
 *
 * This schema initializes and verifies Relying Party client configuration.
 * RelyingParty objects can be persisted and rehydrated. By encapsulating this data in
 * it's own class, it's possible to have multiple RP configurations running
 * simultaneously.
 */
const schema = new JSONSchema({
  type: 'object',
  properties: {

    /**
     * provider
     *
     * Information about the provider, including issuer URL, human readable name,
     * and any configuration or provider metadata retrieved from the OP.
     */
    provider: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        issuer: { type: 'string', format: 'url' },
        // NOTE:
        // OpenID Configuration (discovery response) and JSON Web Keys Set for an
        // issuer can be cached here. However the cache should not be persisted or
        // relied upon.
        //
        // configuration: {}, // .well-known/openid-configuration
        // jwks: {}           // /jwks
      },
      required: ['url']
    },

    /**
     * params
     *
     * Default request parameters for authentication and dynamic registration requests.
     * These values can be extended or overridden via arguments to the respective
     * request methods.
     *
     * These are part of the relying party client configuration and can be serialized
     * and persisted.
     */
    params: {
      type: 'object',
      properties: {

        /**
         * Default authentication request parameters
         */
        authenticate: {
          type: 'object',
          properties: {
            response_type: {
              type: 'string',
              default: 'id_token token' // browser detection
              enum: [
                'code',
                'token',
                'id_token token',
                'id_token token code'
              ]
            },
            display: {
              type: 'string',
              default: 'page',
              enum: [
                'page',
                'popup'
              ]
            },
            scope: {
              type: ['string', 'array'],
              default: ['openid']
            }
          }
        },

        /**
         * Default client registration parameters
         */
        register: {}
      }
    },

    /**
     * registration
     *
     * This is the client registration response from dynamic registration. It should
     * always reflect the client configuration on the openid provider. A client access
     * token is stored here
     */
    registration: ClientMetadataSchema
  },
  required: ['issuer']
})

/**
 * RelyingParty
 *
 * @class
 * Client interface for OpenID Connect Relying Party.
 *
 * @example
 *  let client = RelyingParty({
 *    issuer: 'https://issuer.com',
 *    client_id: 'uuid'
 *    response_type: 'id_token',
 *    display: 'popup',
 *    scope: 'openid profile email'
 *  })
 *
 *  client.discover() => Promise
 *  client.keys() => Promise
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
    return schema
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
    return AuthenticationRequest.uri(this)
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
