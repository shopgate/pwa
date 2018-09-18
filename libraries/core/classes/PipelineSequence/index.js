/**
 * A sequence of pipeline requests.
 */
class PipelineSequence {
  /**
   * Constructor.
   */
  constructor() {
    this.sequence = [];
  }

  /**
   * Adds a new serial to the sequence.
   * @param {string} serial The pipeline request serial.
   */
  set(serial) {
    const index = this.sequence.indexOf(serial);

    if (index < 0) {
      this.sequence.push(serial);
    }
  }

  /**
   * Returns the sequence.
   * @return {Array}
   */
  get() {
    return this.sequence;
  }

  /**
   * Removes a serial from the sequence.
   * @param {string} serial The pipeline request serial.
   */
  remove(serial) {
    const index = this.sequence.indexOf(serial);

    if (index >= 0) {
      this.sequence.splice(index, 1);
    }
  }
}

export default new PipelineSequence();
