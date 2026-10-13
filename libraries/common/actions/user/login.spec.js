import { EINVALIDCALL } from '@shopgate/pwa-core/constants/Pipeline';
import { getRecaptchaToken } from '@shopgate/engage/core/helpers';
import { requestLogin, successLogin, errorLogin } from '../../action-creators/user';
import login from './login';

let mockSuccessResponse;
let mockErrorResponse;
let mockedRequest;
jest.mock('@shopgate/pwa-core', () => {
  const { mockedPipelineRequestFactory } = jest.requireActual('@shopgate/pwa-core/classes/PipelineRequest/mock');

  const MockedPipelineRequest = mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
    mockedRequest = mockInstance;

    if (mockErrorResponse === undefined) {
      resolve(mockSuccessResponse);
    } else {
      reject(mockErrorResponse);
    }
  });

  return {
    ...jest.requireActual('@shopgate/pwa-core/constants/Pipeline'),
    PipelineRequest: class extends MockedPipelineRequest {
      /**
       * Marks the request as trusted.
       * @returns {MockedPipelineRequest}
       */
      setTrusted() {
        this.trusted = true;
        return this;
      }
    },
  };
});
jest.mock('@shopgate/engage/core/helpers', () => ({
  getRecaptchaToken: jest.fn(),
}));

describe('User - actions - login', () => {
  const dispatch = jest.fn();
  const parameters = {
    login: 'user@example.com',
    password: 'secret',
  };
  const redirect = { location: '/checkout' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSuccessResponse = {
      success: true,
      sessionLifetimeInSeconds: 1209480,
    };
    mockErrorResponse = undefined;
    getRecaptchaToken.mockResolvedValue(undefined);
  });

  it('should dispatch the request and the success action', async () => {
    await login(parameters, redirect)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(requestLogin(parameters.login, parameters.password, 'basic'));
    expect(dispatch).toHaveBeenCalledWith(successLogin(redirect, 'basic', 1209480));
    expect(mockedRequest.trusted).toBe(true);
    expect(mockedRequest.input).toEqual({
      strategy: 'basic',
      parameters,
    });
  });

  it('should add a reCAPTCHA token without waiting for the script', async () => {
    getRecaptchaToken.mockResolvedValueOnce('token');

    await login(parameters, redirect)(dispatch);

    expect(getRecaptchaToken).toHaveBeenCalledWith('login', 0);
    expect(mockedRequest.input).toEqual({
      strategy: 'basic',
      parameters: {
        ...parameters,
        recaptchaToken: 'token',
      },
    });
  });

  it('should dispatch the error action when the login was not successful', async () => {
    mockSuccessResponse = {
      success: false,
      messages: ['Failed'],
    };

    await login(parameters, redirect)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(errorLogin(['Failed']));
  });

  it('should dispatch the success action when the user is already logged in', async () => {
    mockErrorResponse = { code: EINVALIDCALL };

    await expect(login(parameters, redirect)(dispatch)).rejects.toEqual(mockErrorResponse);
    expect(dispatch).toHaveBeenCalledWith(successLogin(redirect, 'basic'));
  });

  it('should dispatch the error action with the code of a failed request', async () => {
    mockErrorResponse = { code: 'EINVALIDCREDENTIALS' };

    await expect(login(parameters, redirect)(dispatch)).rejects.toEqual(mockErrorResponse);
    expect(dispatch).toHaveBeenCalledWith(errorLogin([], 'EINVALIDCREDENTIALS'));
  });
});
