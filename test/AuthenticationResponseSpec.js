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
const AuthenticationResponse = require('../src/AuthenticationResponse')

/**
 * Tests
 */
describe('AuthenticationResponse', () => {
  describe('constructor', () => {
    it('should assign argument properties')
  })

  describe('validateResponse', () => {
    describe('with error response', () => {
      it('should return a promise')
      it('should reject with AuthorizationError')
    })

    describe('with invalid access token response', () => {
      it('should return a promise')
      it('should reject with InvalidAccessToken')
    })

    describe('with invalid id token response', () => {
      it('should return a promise')
      it('should reject with InvalidIDToken')
    })

    describe('with invalid nonce response', () => {
      it('should return a promise')
      it('should reject with InvalidNonce')
    })

    describe('with invalid at_hash response', () => {
      it('should return a promise')
      it('should reject with InvalidAccessTokenHash')
    })

    describe('with valid success response', () => {
      it('should return a promise')
      it('should resolve parsed response with decoded tokens')
      it('should set session')
    })
  })
})

