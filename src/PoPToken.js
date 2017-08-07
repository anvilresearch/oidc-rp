'use strict'

const {JWT} = require('@trust/jose')

const DEFAULT_MAX_AGE = 3600  // Default token expiration, in seconds

class PoPToken extends JWT {
  /**
   * @param providerUri {string}
   * @param idToken {IDToken}
   * @param rp {RelyingParty}
   *
   * @returns {Promise<string>} PoPToken, encoded as compact JWT
   */
  static issueFor (providerUri, idToken, rp) {
    const clientId = rp.registration['client_id']

    return rp.sessionPrivateKey()
      .then(jwk => {
        let options = {
          key: jwk,
          aud: providerUri,
          iss: clientId,
          id_token: idToken
        }

        return PoPToken.issue(options)
      })
      .then(jwt => {
        return jwt.encode()
      })
  }

  /**
   * issue
   *
   * @param options {Object}
   * @param options.aud {string|Array<string>} Audience for the token
   *   (such as the Relying Party client_id)
   * @param options.azp {string} Authorized party / Presenter (RP client_id)
   *
   * Optional:
   * @param [options.alg] {string} Algorithm for signing the id token
   * @param [options.iat] {number} Issued at timestamp (in seconds)
   * @param [options.max] {number} Max token lifetime in seconds
   * @param [options.key] {JWK} Proof of Possession (private) signing key, see
   *   https://tools.ietf.org/html/rfc7800#section-3.1
   *
   * @returns {PoPToken} Proof of Possession Token (JWT instance)
   */
  static issue (options) {
    let { aud, iss, key } = options

    let alg = key.alg
    let iat = options.iat || Math.floor(Date.now() / 1000)
    let max = options.max || DEFAULT_MAX_AGE

    let exp = iat + max  // token expiration

    let header = { alg }
    let payload = { iss, aud, exp, iat, id_token: options.id_token, token_type: 'pop' }

    let jwt = new PoPToken({ header, payload, key: key.cryptoKey }, { filter: false })

    return jwt
  }
}

module.exports = PoPToken
