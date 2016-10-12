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
const AuthenticationRequest = require('../src/AuthenticationRequest')

/**
 * Tests
 */
describe('AuthenticationRequest', () => {
  describe('constructor', () => {
    it('should assign argument properties')
    it('should assert the provider property is present')
    it('should assert the provider url is defined')
    it('should assert the session store is defined')
  })

  describe('popup', () => {
    it('should set "width"')
    it('should set "height"')
    it('should set "left"')
    it('should set "top"')
    it('should set "dialog"')
    it('should set "dependent"')
    it('should set "scrollbars"')
    it('should set "location"')
  })

  describe('submit', () => {
    describe('popup', () => {
      it('should open the authentication request URI in a new window')
    })

    describe('page', () => {
      it('should set window location')
    })
  })

  describe('uri', () => {
    it('return a promise')
    it('should reject with missing OpenID Configuration')
    it('should reject with missing authorize endpoint')
    it('should reject with missing client registration')
    it('should set client_id param')
    it('should set redirect_uri param')
    it('should set response_type param')
    it('should set scope param')
    it('should set display param')
    it('should set nonce param')
    it('should set param from options')
    it('should set additional param')
  })

  describe('nonce', () => {
    it('should reject with missing client registration')
    it('should reject with missing client id')
    it('should store random nonce value in session')
    it('should resolve SHA-256 digest of random value')
  })
})

