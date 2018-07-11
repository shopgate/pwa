const pipelineName = 'TestPipeline';
const dependecies1 = ['TestPipeline1', 'TestPipeline2'];
const dependecies2 = ['TestPipeline3', 'TestPipeline4'];
const defaultResult = new Set();

const mockLogGroup = jest.fn();

jest.mock('../../helpers/logGroup', () => (...args) => mockLogGroup(args));

/**
 * Creates a fresh instance
 * @return {PipelineDependencies}
 */
const getInstance = () => {
  const instance = require.requireActual('./index').default;
  return instance;
};

describe('PipelineBuffer', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should get default', () => {
    const pipelineDependencies = getInstance();
    let result = pipelineDependencies.get(pipelineName);
    expect(result).toEqual(defaultResult);

    result = pipelineDependencies.get();
    expect(result).toEqual(defaultResult);
    expect(mockLogGroup).toHaveBeenCalledTimes(0);
  });

  it('should set default', () => {
    const pipelineDependencies = getInstance();

    pipelineDependencies.set(pipelineName);
    const result = pipelineDependencies.get(pipelineName);
    expect(result).toEqual(defaultResult);
    expect(mockLogGroup).toHaveBeenCalledTimes(0);
  });

  it('should set dependencies', () => {
    const pipelineDependencies = getInstance();

    pipelineDependencies.set(pipelineName, dependecies1);
    let result = new Set(dependecies1);
    expect(pipelineDependencies.get(pipelineName)).toEqual(result);

    // Add more
    pipelineDependencies.set(pipelineName, dependecies2);
    result = new Set([...dependecies1, ...dependecies2]);
    expect(pipelineDependencies.get(pipelineName)).toEqual(result);

    expect(mockLogGroup).toHaveBeenCalledTimes(2);
  });
});
