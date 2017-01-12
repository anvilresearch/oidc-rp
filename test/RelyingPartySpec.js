'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const RelyingParty = require('../src/RelyingParty')

/**
 * Tests
 */
describe('RelyingParty', () => {
  describe('class', () => {
    it('should inherit from JSONDocument')
  })

  describe('schema', () => {
    it('should by the RelyingPartySchema')
  })

  describe('from', () => {
    it('should reject with invalid argument')
    it('should request JWK Set if missing from argument')
    it('should import JWK Set if defined in argument')
  })

  describe('static register', () => {
    it('should return a promise')
    it('should resolve a RelyingParty instance')
    it('should request OpenID configuration')
    it('should import provider JWK Set')
    it('should register a client')
  })

  describe('discover', () => {
    it('return a promise')
    it('should reject with missing provider url (issuer)')
    it('should resolve provider OpenID Configuration')
    it('should set provider OpenID Configuration')
  })

  describe('jwks', () => {
    it('return a promise')
    it('should reject with missing OpenID Configuration')
    it('should reject with missing jwks uri')
    it('should import JWKs')
    it('should set provider JWK Set')
    it('should resolve JWK Set')
  })

  describe('logout', () => {
    it('should reject with missing OpenID Configuration', done => {
      let rp = new RelyingParty()
      rp.logout()
        .catch(err => {
          expect(err.message).to.equal('OpenID Configuration is not initialized.')
          done()
        })
    })

    it('should reject with missing end_session_endpoint', done => {
      let options = {
        provider: {
          configuration: {
            issuer: 'https://forge.anvil.io'
          }
        }
      }
      let rp = new RelyingParty(options)
      rp.logout()
        .catch(err => {
          expect(err.message).to.equal('OpenID Configuration is missing end_session_endpoint.')
          done()
        })
    })

    it('should make a request to the end_session_endpoint')
  })

  describe('register', () => {
    it('return a promise')
    it('should reject with missing OpenID Configuration')
    it('should reject with missing registration endpoint')
    it('should resolve registration')
    it('should set client registration')
  })

  describe('userinfo', () => {
    it('return a promise')
    it('should reject with missing OpenID Configuration')
    it('should reject with missing userinfo endpoint')
    it('should reject with missing access token')
    it('should resolve parsed JSON response')
  })
})
