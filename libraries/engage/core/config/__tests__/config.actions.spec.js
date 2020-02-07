import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import {
  requestConfig,
  receiveConfig,
} from '../config.action-creators';
import { fetchConfig } from '../config.actions';

jest.mock('@shopgate/pwa-common/helpers/redux', () => ({
  shouldFetchData: jest.fn(),
}));
jest.mock('../config.action-creators', () => ({
  requestConfig: jest.fn(),
  receiveConfig: jest.fn(),
  errorConfig: jest.fn(),
}));

describe('engage > core > config > actions', () => {
  const dispatch = jest.fn();
  const getState = jest.fn().mockReturnValue({
    config: {
      foo: 'bar',
    },
  });

  let fetchConfigThunk;
  let spyPipelineRequest;

  beforeEach(() => {
    fetchConfigThunk = fetchConfig();
    spyPipelineRequest = jest.spyOn(PipelineRequest.prototype, 'dispatch');
  });

  afterEach(jest.clearAllMocks);

  it('should fetch config', (done) => {
    expect.assertions(4);

    shouldFetchData.mockReturnValueOnce(true);
    spyPipelineRequest.mockReturnValueOnce(Promise.resolve({ foo: 'bar' }));

    const result = fetchConfigThunk(dispatch, getState);

    expect(result).resolves.toEqual({ foo: 'bar' });

    setTimeout(() => {
      expect(requestConfig).toBeCalledTimes(1);
      expect(receiveConfig).toBeCalledWith({ foo: 'bar' });
      expect(dispatch).toBeCalledTimes(2);
      done();
    });
  });

  it('should return cached config', () => {
    shouldFetchData.mockReturnValueOnce(false);

    const result = fetchConfigThunk(dispatch, getState);

    expect(result).resolves.toEqual({ foo: 'bar' });
    expect(spyPipelineRequest).toHaveBeenCalledTimes(0);
  });
});
