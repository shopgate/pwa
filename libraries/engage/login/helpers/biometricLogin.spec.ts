import { Keychain } from '@shopgate/native-modules';
import { appSupportsBiometricLogin } from '../../core/helpers/appFeatures';
import {
  getBiometricLoginStatus,
  storeBiometricLogin,
  resetBiometricLogin,
} from './biometricLogin';

jest.mock('@shopgate/native-modules', () => ({
  Keychain: {
    getLoginStatus: jest.fn(),
    setLogin: jest.fn(),
    resetLogin: jest.fn(),
  },
}));

jest.mock('../../core/helpers/appFeatures', () => ({
  appSupportsBiometricLogin: jest.fn(),
}));

const getLoginStatus = Keychain.getLoginStatus as jest.Mock;
const setLogin = Keychain.setLogin as jest.Mock;
const resetLogin = Keychain.resetLogin as jest.Mock;

const unavailable = {
  available: false,
  enabled: false,
  biometryType: null,
};

describe('biometric login helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (appSupportsBiometricLogin as jest.Mock).mockReturnValue(true);
  });

  describe('getBiometricLoginStatus()', () => {
    it('should report everything as off in apps without the feature flag', async () => {
      (appSupportsBiometricLogin as jest.Mock).mockReturnValue(false);

      await expect(getBiometricLoginStatus()).resolves.toEqual(unavailable);
      expect(getLoginStatus).not.toHaveBeenCalled();
    });

    it('should resolve with the status of the app', async () => {
      getLoginStatus.mockResolvedValueOnce({
        available: true,
        enabled: true,
        biometryType: 'FaceID',
      });

      await expect(getBiometricLoginStatus()).resolves.toEqual({
        available: true,
        enabled: true,
        biometryType: 'FaceID',
      });
    });

    it('should resolve as unavailable when the app rejects the call', async () => {
      getLoginStatus.mockRejectedValueOnce({
        message: 'Function getLoginStatus in Keychain not found',
      });

      await expect(getBiometricLoginStatus()).resolves.toEqual(unavailable);
    });

    it('should resolve as unavailable when the app does not answer with a status', async () => {
      getLoginStatus.mockResolvedValueOnce(undefined);

      await expect(getBiometricLoginStatus()).resolves.toEqual(unavailable);
    });

    it('should resolve as unavailable when the bridge throws', async () => {
      getLoginStatus.mockImplementationOnce(() => {
        throw new TypeError('SGAppInfo is undefined');
      });

      await expect(getBiometricLoginStatus()).resolves.toEqual(unavailable);
    });
  });

  describe('storeBiometricLogin()', () => {
    const prompt = { title: 'Use Face ID' };

    it('should pass the credentials and the prompt to the app', async () => {
      setLogin.mockResolvedValueOnce(true);

      await expect(storeBiometricLogin({
        login: 'user',
        password: 'secret',
        prompt,
      })).resolves.toEqual({ success: true });
      expect(setLogin).toHaveBeenCalledWith('user', 'secret', prompt);
    });

    it('should resolve with the error of the app', async () => {
      setLogin.mockRejectedValueOnce({
        code: '-128',
        message: 'User canceled the operation.',
      });

      await expect(storeBiometricLogin({
        login: 'user',
        password: 'secret',
      })).resolves.toEqual({
        success: false,
        code: '-128',
        message: 'User canceled the operation.',
        reason: 'canceled',
      });
    });
  });

  describe('app resolving with false', () => {
    it('should report a failed save', async () => {
      setLogin.mockResolvedValueOnce(false);

      await expect(storeBiometricLogin({
        login: 'user',
        password: 'secret',
      })).resolves.toEqual({
        success: false,
        reason: 'unknown',
      });
    });

    it('should report a failed removal', async () => {
      resetLogin.mockResolvedValueOnce(false);

      await expect(resetBiometricLogin()).resolves.toEqual({
        success: false,
        reason: 'unknown',
      });
    });

    it('should count a call without a value as done', async () => {
      setLogin.mockResolvedValueOnce(undefined);

      await expect(storeBiometricLogin({
        login: 'user',
        password: 'secret',
      })).resolves.toEqual({ success: true });
    });
  });

  describe('resetBiometricLogin()', () => {
    it('should resolve successfully when the credentials were removed', async () => {
      resetLogin.mockResolvedValueOnce(true);

      await expect(resetBiometricLogin()).resolves.toEqual({ success: true });
    });

    it('should resolve with the error of the app', async () => {
      resetLogin.mockRejectedValueOnce({ message: 'Failed' });

      await expect(resetBiometricLogin()).resolves.toEqual({
        success: false,
        message: 'Failed',
        reason: 'unknown',
      });
    });
  });
});
