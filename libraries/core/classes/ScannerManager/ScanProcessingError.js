/**
 * The ScanProcessingError is supposed to be thrown in case of a processing error of the scanned
 * content. It's properties will be used to display an error message to the user.
 * @extends Error
 */
class ScanProcessingError extends Error {
  /**
   * Constructor for the ScanProcessingError
   * @param {string} message The message of the error.
   * @param {string} [title=null] The title of the error.
   */
  constructor(message, title = null) {
    super(message);

    this.title = title;
  }
}

export default ScanProcessingError;
