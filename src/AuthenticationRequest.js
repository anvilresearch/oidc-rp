/**
 * Dependencies
 */

/**
 * Authentication Request
 */
class AuthenticationRequest {

  /**
   * Constructor
   */
  constructor (rp) {
    Object.assign(this, rp)
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

}

/**
 * Export
 */
module.exports = AuthenticationRequest
