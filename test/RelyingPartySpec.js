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

  describe('static register', () => {
    it('should return a promise')
    it('should resolve a RelyingParty instance')
    it('should request OpenID configuration')
    it('should import provider JWK Set')
    it('should register a client')
  })

  describe('authenticate', () => {
    it('should return a promise')
  })

  describe('authenticateUri', () => {
    it('should return a promise')
  })

  describe('discover', () => {
    it('return a promise')
    it('should reject with missing provider url (issuer)')
    it('should resolve provider OpenID Configuration')
    it('should set provider OpenID Configuration')
  })

  describe('isAuthenticated', () => {})

  describe('jwks', () => {
    it('return a promise')
    it('should reject with missing OpenID Configuration')
    it('should reject with missing jwks uri')
    it('should import JWKs')
    it('should set provider JWK Set')
    it('should resolve JWK Set')
  })

  describe('logout', () => {})

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
