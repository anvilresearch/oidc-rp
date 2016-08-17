/**
 * Dependencies
 */
const {JSONSchema, JSONDocument} = require('json-document')
const AuthenticationRequest = require('./AuthenticationRequest')
const AuthenticationResponse = require('./AuthenticationResponse')
// const Session = require('./Session')

/**
 * RelyingParty Schema
 */
const schema = new JSONSchema({
  type: 'object',
  properties: {
    issuer: {
      type: 'string',
      format: 'uri'
    },
    client_id: {
      type: 'string'
    },
    response_type: {
      type: 'string',
      default: 'id_token token',
      enum: ['id_token token']
    },
    display: {
      type: 'string',
      default: 'page',
      enum: ['page', 'popup']
    },
    scope: {
      type: ['string', 'array'],
      default: ['openid']
    }
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
    return Promise
      .resolve(new RelyingParty(options))
      .then(client => client.discover())
      .then(client => client.jwks())
      .then(client => client)
      .catch(/* err => {} */)
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
  discover () {}

  /**
   * Register
   *
   * @description Register's a client with provider as a Relying Party
   * @returns {Promise}
   */
  register () {}

  /**
   * Keys
   *
   * @description Promises the issuer's JWK Set.
   * @returns {Promise}
   */
  keys () {}

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
   * UserInfo
   */
  userinfo () {}

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
