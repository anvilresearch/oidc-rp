/**
 * Dependencies
 */
const URL = require('urlutils')
const {JWT} = require('jose')
const Nonce = require('./Nonce')
const FormUrlencoded = require('./FormUrlencoded')

/**
 * AuthenticationResponse
 */
class AuthenticationResponse {

  /**
   * constructor
   */
  constructor (rp) {
    Object.assign(this, rp)
    // make some assertions
  }

  /**
   * validateResponse
   */
  validateResponse (uri) {
    let url = new URL(uri)
    let response = FormUrlencoded.decode(url.hash.substring(1))

    // authentication error response
    if (response.error) {
      this.session.reset()
      return Promise.reject(response.error)

    // authentication success response
    } else {
      let {provider: {jwks: {keys}}} = this
      let {id_token: idToken, access_token: accessToken} = response
      let verifications = []

      // verify access token
      // TODO be sure it's a JWT first
      if (accessToken) {
        let jwt = JWT.decode(accessToken)
        let kid = jwt.header.kid

        if (!kid) {
          jwt.key = keys.find(jwk => jwk.use === 'sig').cryptoKey
        } else {
          jwt.key = keys.find(jwk => jwk.kid === kid).cryptoKey
        }

        // TODO store the decoded token somewhere

        verifications.push(jwt.verify())
      }

      // verify id token
      if (idToken) {
        let jwt = JWT.decode(idToken)
        let kid = jwt.header.kid

        if (!kid) {
          jwt.key = keys.find(jwk => jwk.use === 'sig').cryptoKey
        } else {
          jwt.key = keys.find(jwk => jwk.kid === kid).cryptoKey
        }
        // TODO store the decoded token somewhere

        verifications.push(jwt.verify())
      }

      return Promise.all(verifications).then(results => {
        let [accessTokenValidity, idTokenValidity] = results
        //let {payload: {nonce, at_hash}} = idJwt

        console.log('Access Token Validity', accessTokenValidity)
        console.log('ID Token Validity', idTokenValidity)
        // validate nonce
        //if (Nonce.verify(nonce, store[`${client_id}:nonce`])) {
        //  return Promise.reject(new Error('Invalid nonce'))
        //}

        //// verify at_hash
        //return idJwt.verifyAccessTokenHash(accessToken).then(() => session)
      })
    }
  }

}

/**
 * Export
 */
module.exports = AuthenticationResponse
