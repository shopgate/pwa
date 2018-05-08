const DEFAULT_ENTRY = [];

/**
 * Stores a buffer of postponed pipeline requests.
 */
class PipelineBuffer {
  /**
   * Constructor.
   */
  constructor() {
    this.buffer = new Map();
  }

  /**
   *
   * @param {string} pipelineName The name of the pipeline request.
   * @param {Array|string} dependant The pipeline request name of the dependant(s).
   */
  set(pipelineName, dependant) {
    if (typeof pipelineName !== 'string') throw new Error(`Expected string for 'pipelineName'. Received: '${typeof pipelineName}'`);
    if (!dependant) throw new Error('No dependant was set!');
    if (!Array.isArray(dependant) && typeof dependant !== 'string') {
      throw new Error(`Expected string or array for 'dependant'. Received: '${typeof dependant}'`);
    }

    const dependants = [].concat(dependant);
    const entry = this.buffer.get(pipelineName);

    if (!entry) {
      this.buffer.set(pipelineName, dependants);
      return;
    }

    this.buffer.set(pipelineName, [
      ...entry,
      ...dependants,
    ]);
  }

  /**
   * Returns the dependants of a pipeline request.
   * @param {string} pipelineName The name of the pipeline request to get the dependants for.
   * @return {Array}
   */
  get(pipelineName) {
    if (typeof pipelineName !== 'string') throw new Error(`Expected string for 'pipelineName'. Received: '${typeof pipelineName}'`);
    const entry = this.buffer.get(pipelineName);

    if (!entry) return DEFAULT_ENTRY;
    return entry;
  }
}

export default new PipelineBuffer();
