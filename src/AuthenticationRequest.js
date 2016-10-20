/**
 * Dependencies
 */
const assert = require('assert')
const base64url = require('base64url')
const crypto = require('webcrypto')
const {TextDecoder} = require('text-encoding')
const FormUrlencoded = require('./FormUrlencoded')
const URL = require('urlutils')

/**
 * Authentication Request
 */
class AuthenticationRequest {

  /**
   * constructor
   *
   * @param {RelyingParty} rp
   */
  constructor (rp) {
    // TODO could we make use of Proxy instead of shallow copying?
    Object.assign(this, rp)
    assert(this.provider, 'Provider must be configured for RelyingParty')
    assert(this.provider.url, 'Provider URL must be configured for RelyingParty')
    assert(this.store, 'A session store must be configured for RelyingParty')
  }

  /**
   * popup
   *
   * @description
   * Configure the authorize popup window
   * Adapted from dropbox-js for ngDropbox
   *
   * @param {Number} popupWidth
   * @param {Number} popupHeight
   *
   * @returns {string}
   */
  static popup (popupWidth, popupHeight) {
    let x0, y0, width, height, popupLeft, popupTop

    // Metrics for the current browser window.
    x0 = window.screenX || window.screenLeft
    y0 = window.screenY || window.screenTop
    width = window.outerWidth || document.documentElement.clientWidth
    height = window.outerHeight || document.documentElement.clientHeight

    // Computed popup window metrics.
    popupLeft = Math.round(x0) + (width - popupWidth) / 2
    popupTop = Math.round(y0) + (height - popupHeight) / 2.5
    if (popupLeft < x0) { popupLeft = x0 }
    if (popupTop < y0) { popupTop = y0 }

    return 'width=' + popupWidth + ',height=' + popupHeight + ',' +
    'left=' + popupLeft + ',top=' + popupTop + ',' +
    'dialog=yes,dependent=yes,scrollbars=yes,location=yes'
  }

  /**
   * submit
   *
   * @param {Object} options
   * @return {Promise}
   */
  submit (options) {
    let authenticate = this.authenticate

    assert(authenticate, 'RelyingParty must default authentication parameters.')

    this.uri(options).then(uri => {
      // detect runtime environment (browser vs Node.js)
      // and behave accordingly.
      // should this throw if called in Node.js?
      if (authenticate.display === 'popup') {
        let {width, height} = this.popup
        // window name should be some kind of client identifier
        window.open(uri, 'rp', AuthenticationRequest.popup(width, height))
      } else {
        window.location = uri
      }
    })
  }

  /**
   * uri
   *
   * @param {Object} options
   * @return {Promise}
   */
  uri (options = {}) {
    try {
      let {provider, registration, store} = this
      let configuration = provider.configuration

      assert(configuration,
        'OpenID Configuration required. Invoke the discover method.')

      let endpoint = configuration.authorization_endpoint

      assert(endpoint,
        'OpenID Configuration does not specify the authorization endpoint.')

      assert(registration,
        'Registration must be provided for the RelyingParty.')

      let client_id = registration.client_id
      let defaults = this.defaults.authenticate
      let redirect_uri = options.redirect_uri || defaults.redirect_uri

      assert(redirect_uri,
        'Redirect URI must be provided for the authentication request.')

      let params = Object.assign({client_id}, defaults, options)

      return this.nonce().then(nonce => {
        params.nonce = nonce
        store['${client_id}:nonce'] = params.nonce

        let url = new URL(endpoint)
        url.search = FormUrlencoded.encode(params)

        return url.href
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * nonce
   *
   * @param {Number} length
   * @return {Promise}
   */
  nonce (length = 16) {

    try {
      assert(this.registration,
        'Missing client registration.')

      assert(this.registration.client_id,
        'Client registration is missing client_id.')

      assert(typeof this.store === 'object',
        'A session store must be configured.')

    } catch (error) {
      return Promise.reject(error)
    }

    let namespace = this.registration.client_id
    let key = `${namespace}:nonce`
    let value = crypto.getRandomValues(new Uint8Array(length))
    let serialized = new TextDecoder().decode(value)
    this.store[key] = serialized

    return crypto.subtle.digest({
      name: 'SHA-256'
    }, value).then(hash => {
      return base64url(Buffer.from(hash))
    })
  }
}

/**
 * Export
 */
module.exports = AuthenticationRequest
