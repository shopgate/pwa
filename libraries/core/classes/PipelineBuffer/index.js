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
    const dependants = [].concat(dependant);
    const entry = this.buffer.get(pipelineName);

    if (!entry) {
      this.buffer.add(pipelineName, dependants);
      return;
    }

    this.buffer.add(pipelineName, [
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
    const entry = this.buffer.get(pipelineName);

    if (!entry) return DEFAULT_ENTRY;
    return entry;
  }
}

export default new PipelineBuffer();
