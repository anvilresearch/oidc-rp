'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
let expect = chai.expect

/**
 * Code under test
 */
const onHttpError = require('../src/onHttpError')

describe('onHttpError', () => {
  it('should pass through the response with status code < 300', () => {
    let response = { status: 200 }
    let errorHandler = onHttpError()

    expect(errorHandler(response)).to.equal(response)
  })

  it('should throw an error on http error response', () => {
    let response = { status: 400, statusText: 'Bad Request' }

    let errorHandler = onHttpError('Error during some operation')

    expect(() => errorHandler(response))
      .to.throw(/Error during some operation: 400 Bad Request/)
  })

  it('should set a default error message', () => {
    let response = { status: 404, statusText: 'Not Found' }

    let errorHandler = onHttpError()

    expect(() => errorHandler(response))
      .to.throw(/fetch error: 404 Not Found/)
  })

  it('should pass through the status code to the error', done => {
    let response = { status: 400, statusText: 'Bad Request' }

    let errorHandler = onHttpError()

    try {
      errorHandler(response)
    } catch (err) {
      expect(err.statusCode).to.equal(400)
      done()
    }
  })

  it('should set the response object on the error', done => {
    let response = { status: 500, statusText: 'Internal Server Error' }

    let errorHandler = onHttpError()

    try {
      errorHandler(response)
    } catch (err) {
      expect(err.response).to.equal(response)
      done()
    }
  })
})
