/**
 * Dependencies
 */
const assert = require('assert')
const base64url = require('base64url')
const crypto = require('@trust/webcrypto')
const FormUrlEncoded = require('./FormUrlEncoded')
const URL = require('urlutils')

/**
 * Authentication Request
 */
class AuthenticationRequest {

  /**
   * create
   *
   * @description
   * Create a new authentication request with generated state and nonce,
   * validate presence of required parameters, serialize the request data and
   * persist it to the session, and return a promise for an authentication
   * request URI.
   *
   * @param {RelyingParty} rp – instance of RelyingParty
   * @param {Object} options - optional request parameters
   * @param {Object} session – reference to localStorage or other session object
   *
   * @returns {Promise}
   */
  static create (rp, options, session) {
    return new Promise((resolve, reject) => {
      let {provider, defaults, registration} = rp

        // validate presence of OP configuration, RP client registration,
        // and default parameters
        assert(provider.configuration,
          'RelyingParty provider OpenID Configuration is missing')

        assert(defaults.authenticate,
          'RelyingParty default authentication parameters are missing')

        assert(registration,
          'RelyingParty client registration is missing')

        // define basic elements of the request
        let issuer = provider.configuration.issuer
        let endpoint = provider.configuration.authorization_endpoint
        let client = { client_id: registration.client_id}
        let params = Object.assign(defaults.authenticate, client, options)

        // validate presence of required configuration and parameters
        assert(issuer,
            'Missing issuer in provider OpenID Configuration')

        assert(endpoint,
            'Missing authorization_endpoint in provider OpenID Configuration')

        assert(params.scope,
            'Missing scope parameter in authentication request')

        assert(params.response_type,
            'Missing response_type parameter in authentication request')

        assert(params.client_id,
            'Missing client_id parameter in authentication request')

        assert(params.redirect_uri,
            'Missing redirect_uri parameter in authentication request')

        // generate state and nonce random octets
        params.state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        params.nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))


        // hash the state and nonce parameter values
        return Promise.all([
          crypto.subtle.digest({ name: 'SHA-256' }, new Uint8Array(params.state)),
          crypto.subtle.digest({ name: 'SHA-256' }, new Uint8Array(params.nonce))
        ])

        // serialize the request with original values, store in session by
        // encoded state param, and replace state/nonce octets with encoded
        // digests
        .then(digests => {
          let state = base64url(Buffer.from(digests[0]))
          let nonce = base64url(Buffer.from(digests[1]))
          let key = `${issuer}/requestHistory/${state}`

          // store the request params for response validation
          // with serialized octet values for state and nonce
          session[key] = JSON.stringify(params)

          // replace state and nonce octets with base64url encoded digests
          params.state = state
          params.nonce = nonce
        })

        // optionally encode a JWT with the request parameters
        .then(() => {
          // TODO
          // optionally encode the request parameters as a JWT
          // and replace params with `{ request: <jwt> }`
        })

        // render the request URI and terminate the algorithm
        .then(() => {
          let url = new URL(endpoint)
          url.search = FormUrlEncoded.encode(params)
          resolve(url.href)
        })
    })
  }

}

/**
 * Export
 */
module.exports = AuthenticationRequest
