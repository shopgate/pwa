import logGroup from '../../helpers/logGroup';

/**
 * Holds the pipeline dependencies.
 */
class PipelineDependencies {
  /**
   * Constructor.
   */
  constructor() {
    this.dependencies = {};
  }

  /**
   * Sets new dependencies for a pipeline request.
   * @param {string} pipelineName The name of the pipeline request.
   * @param {Array|string} dependencies Pipeline names to set as a dependency.
   */
  set(pipelineName, dependencies = []) {
    const newDependencies = [].concat(dependencies);

    if (!dependencies || !dependencies.length) {
      return;
    }

    if (!this.has(pipelineName)) {
      this.dependencies[pipelineName] = new Set(newDependencies);
    } else {
      newDependencies.forEach(dep => this.dependencies[pipelineName].add(dep));
    }

    logGroup(`PipelineDependencies %c${pipelineName}`, this.dependencies, '#FFCD34');
  }

  /**
   * Returns a list of pipeline names that are a dependency of a pipeline request.
   * @param {string} pipelineName The name of the pipeline request.
   * @return {Set}
   */
  get(pipelineName) {
    if (!pipelineName || !this.has(pipelineName)) {
      return new Set();
    }

    return this.dependencies[pipelineName];
  }

  /**
   * Checks if a pipeline has dependencies registered
   * @param {string} pipelineName The pipeline name
   * @return {boolean}
   */
  has(pipelineName) {
    return this.dependencies.hasOwnProperty(pipelineName);
  }
}

export default new PipelineDependencies();
