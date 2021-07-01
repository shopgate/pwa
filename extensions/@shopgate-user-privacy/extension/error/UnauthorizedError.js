/**
 * The Unauthorized error object.
 */
class UnauthorizedError extends Error {
  /**
   * @param {string} message The error message.
   */
  constructor (message = '') {
    super()

    this.code = 'EACCESS'
    this.message = `Permission denied ${message}`
  }
}

module.exports = UnauthorizedError
