/**
 * Dependencies
 */
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
      let {provider: {jwks}} = this
      let idToken = response['id_token']
      let accessToken = response['access_token']
      let verifications = []

      // verify access token
      // TODO be sure it's a JWT first
      if (access_token) {
        let jwt = JWT.decode(access_token)
        let kid = jwt.header.kid

        // TODO store the decoded token somewhere

        jwt.key = jwks.find(kid)
        verifications.push(jwt.verify())
      }

      // verify id token
      if (id_token) {
        let jwt = JWT.decode(id_token)
        let kid = jwt.header.kid

        // TODO store the decoded token somewhere

        jwt.key = jwks.find(kid)
        verifications.push(jwt.verify())
      }

      return Promise.all(verifications).then(results => {
        let [accessJwt, idJwt] = results
        let {payload: {nonce, at_hash}} = idJwt

        // validate nonce
        if (Nonce.verify(nonce, store[`${client_id}:nonce`])) {
          return Promise.reject(new Error('Invalid nonce'))
        }

        // verify at_hash
        return idJwt.verifyAccessTokenHash(accessToken).then(() => session)
      })
    }
  }

}

/**
 * Export
 */
module.exports = AuthenticationResponse
