class UnauthorizedError extends Error {
  constructor (message = '') {
    super()

    this.code = 'EACCESS'
    this.message = `Permission denied ${message}`
  }
}

module.exports = UnauthorizedError
