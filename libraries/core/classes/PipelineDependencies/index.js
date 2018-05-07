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

    if (!this.get(pipelineName)) {
      this.dependencies[pipelineName] = new Set(newDependencies);
      return;
    }

    this.dependencies[pipelineName].add(...newDependencies);
    logGroup(`PipelineDependencies set %c${pipelineName}`, {
      dependencies: this.dependencies,
    }, '#FFCD34');
  }

  /**
   * Returns a list of pipeline names that are a dependency of a pipeline request.
   * @param {string} pipelineName The name of the pipeline request.
   * @return {Array}
   */
  get(pipelineName) {
    return this.dependencies[pipelineName];
  }
}

export default new PipelineDependencies();
