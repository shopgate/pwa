import { Keychain } from '@shopgate/native-modules';
import { SUCCESS_LOGIN } from '@shopgate/pwa-common/constants/ActionTypes';
import { getRecaptchaToken } from '../../core/helpers/recaptcha';
import biometricLogin from './biometricLogin';

jest.mock('@shopgate/native-modules', () => ({
  Keychain: {
    login: jest.fn(),
  },
}));
jest.mock('../../core/helpers/recaptcha', () => ({
  getRecaptchaToken: jest.fn(),
}));

const login = Keychain.login as jest.Mock;
const getToken = getRecaptchaToken as jest.Mock;

describe('biometricLogin()', () => {
  const dispatch = jest.fn();
  const prompt = { title: 'Sign in' };

  beforeEach(() => {
    jest.clearAllMocks();
    getToken.mockResolvedValue('token');
  });

  it('should log in via the app with a fresh reCAPTCHA token', async () => {
    login.mockResolvedValueOnce({
      pipelineResponse: {
        success: true,
        sessionLifetimeInSeconds: 1209480,
      },
    });

    await expect(biometricLogin({ prompt })(dispatch)).resolves.toEqual({ success: true });

    expect(getToken).toHaveBeenCalledWith('login');
    expect(login).toHaveBeenCalledWith('token', prompt);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: SUCCESS_LOGIN,
      redirect: false,
      strategy: 'basic',
      sessionLifetimeInSeconds: 1209480,
    });
  });

  it('should log in without a token when reCAPTCHA is not available', async () => {
    getToken.mockResolvedValueOnce(undefined);
    login.mockResolvedValueOnce({ pipelineResponse: { success: true } });

    await expect(biometricLogin()(dispatch)).resolves.toEqual({ success: true });
    expect(login).toHaveBeenCalledWith(undefined, undefined);
  });

  it('should not dispatch when the pipeline response is not successful', async () => {
    login.mockResolvedValueOnce({ pipelineResponse: { success: false } });

    await expect(biometricLogin()(dispatch)).resolves.toEqual({ success: false });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch when the app does not answer with a response', async () => {
    login.mockResolvedValueOnce(undefined);

    await expect(biometricLogin()(dispatch)).resolves.toEqual({ success: false });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should resolve with the error code of the app or the pipeline', async () => {
    login.mockRejectedValueOnce({
      code: 'EINVALIDCREDENTIALS',
      message: 'Invalid credentials',
    });

    await expect(biometricLogin()(dispatch)).resolves.toEqual({
      success: false,
      code: 'EINVALIDCREDENTIALS',
      message: 'Invalid credentials',
    });
    expect(dispatch).not.toHaveBeenCalled();
  });
});
