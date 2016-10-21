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
const IDToken = require('../src/IDToken')
const IDTokenSchema = require('../src/IDTokenSchema')

/**
 * Tests
 */
describe('IDToken', () => {
  describe('schema', () => {
    it('should be IDTokenSchema', () => {
      IDToken.schema.should.equal(IDTokenSchema)
    })
  })
})
