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
const FormUrlEncoded = require('../src/FormUrlEncoded')

/**
 * Tests
 */
describe('FormUrlEncoded', () => {
  describe('encode', () => {
    it('should return a string')
    it('should separate key and value with "="')
    it('should separate key/value pairs with "/"')
    it('should encode URI components')
  })

  describe('decode', () => {
    it('should return an object')
    it('should parse key/value pairs')
    it('should decode URI components')
  })
})

