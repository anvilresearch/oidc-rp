'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.use(require('dirty-chai'))
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const Session = require('../src/Session')
const RelyingParty = require('../src/RelyingParty')

const providerUri = 'https://provider.example.com'

const decoded = {
  header: {},
  payload: { iss: providerUri }
}

const params = {
  access_token: 'access t0ken',
  id_token: 'id t0ken'
}

const rp = {
  defaults: { popToken: true },
  registration: {
    client_id: 'client123'
  }
}
const sessionKey = 'session key'

const session = {}

session[RelyingParty.SESSION_PRIVATE_KEY] = sessionKey

const response = { decoded, params, rp, session }

describe('Session', () => {
  describe('fromAuthResponse', () => {
    let session

    before(() => {
      session = Session.fromAuthResponse(response)
    })

    it('should init the issuer', () => {
      expect(session.issuer).to.equal(providerUri)
    })

    it('should init the client id', () => {
      expect(session.authorization.client_id).to.equal('client123')
    })

    it('should init the decoded id token', () => {
      expect(session.idClaims).to.equal(decoded.payload)
    })

    it('should init the session key', () => {
      expect(session.sessionKey).to.equal(sessionKey)
    })

    it('should init the id token', () => {
      expect(session.authorization.id_token).to.equal('id t0ken')
    })

    it('should init the access token', () => {
      expect(session.authorization.access_token).to.equal('access t0ken')
    })

    it('should init credentialType based on rp popToken semantics flag', () => {
      expect(session.credentialType).to.equal('pop_token')
    })
  })
})
