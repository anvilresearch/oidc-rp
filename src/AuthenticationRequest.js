/**
 * Dependencies
 */
const Nonce = require('./Nonce')
const FormUrlencoded = require('./FormUrlencoded')

/**
 * Authentication Request
 */
class AuthenticationRequest {

  /**
   * Constructor
   */
  constructor (rp) {
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
   */
  uri (options) {
    let store = this.store
    let provider = this.provider
    let configuration = provider.configuration
    assert(configuration, 'OpenID Configuration required. Invoke the discover method.')

    let endpoint = configuration.authorization_endpoint
    assert(endpoint, 'OpenID Configuration does not specify the authorize endpoint.')

    let registration = this.registration
    assert(registration, 'Registration must be provided for the RelyingParty.')

    let client_id = registration.client_id

    let defaults = provider.authenticate
    let params = Object.assign({client_id}, defaults, options)

    params.nonce = Nonce.generate(16)
    store['${client_id}:nonce'] = params.nonce

    let url = new URL(endpoint)
    url.search = FormUrlencoded.encode(params)

    return url.href
  }

}

/**
 * Export
 */
module.exports = AuthenticationRequest
