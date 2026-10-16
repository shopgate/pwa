import { getBiometricLoginErrorReason } from './biometricLoginErrors';

describe('getBiometricLoginErrorReason()', () => {
  it('should recognize credentials the backend rejected', () => {
    expect(getBiometricLoginErrorReason({
      code: 'EINVALIDCREDENTIALS',
      message: 'Invalid credentials',
    })).toBe('invalidCredentials');
  });

  it('should recognize credentials the app couldn\'t read', () => {
    expect(getBiometricLoginErrorReason({
      code: 'BIOMETRIC_AUTH_FAILED',
      message: 'Biometric authentication failed',
    })).toBe('invalidated');
  });

  describe('iOS', () => {
    it('should recognize a canceled prompt', () => {
      expect(getBiometricLoginErrorReason({
        code: '-128',
        message: 'User canceled the operation.',
      })).toBe('canceled');
    });

    it('should recognize biometrics that weren\'t accepted', () => {
      expect(getBiometricLoginErrorReason({
        code: '-25293',
        message: 'The user name or passphrase you entered is not correct.',
      })).toBe('authFailed');
    });

    it('should recognize a locked device', () => {
      expect(getBiometricLoginErrorReason({
        code: '-25308',
        message: 'User interaction is not allowed.',
      })).toBe('interrupted');
    });

    it('should recognize missing credentials', () => {
      expect(getBiometricLoginErrorReason({
        code: '-25300',
        message: 'The specified item could not be found in the keychain.',
      })).toBe('invalidated');
    });
  });

  describe('Android', () => {
    /**
     * Creates the error details of the keychain library for a code of the biometric prompt.
     * @param promptCode The code of the biometric prompt.
     * @param text The text of the system, in the language of the device.
     * @returns The error details.
     */
    const promptError = (promptCode: number, text = 'Irrelevant') => ({
      code: 'E_CRYPTO_FAILED',
      message: `code: ${promptCode}, msg: ${text}`,
    });

    it('should recognize a canceled prompt by its code only', () => {
      expect(getBiometricLoginErrorReason(promptError(13, 'Cancel'))).toBe('canceled');
      expect(getBiometricLoginErrorReason(promptError(10, 'Fingerprint operation cancelled by user')))
        .toBe('canceled');
      expect(getBiometricLoginErrorReason(promptError(10, 'Vorgang vom Nutzer abgebrochen')))
        .toBe('canceled');
    });

    it('should recognize a prompt the system ended', () => {
      expect(getBiometricLoginErrorReason(promptError(5, 'Fingerprint operation cancelled')))
        .toBe('interrupted');
      expect(getBiometricLoginErrorReason(promptError(3, 'Timeout'))).toBe('interrupted');
    });

    it('should recognize a lockout', () => {
      expect(getBiometricLoginErrorReason(promptError(
        7,
        'Biometric verification isn\'t available because of too many incorrect attempts.'
      ))).toBe('lockout');
      expect(getBiometricLoginErrorReason(promptError(9))).toBe('lockout');
    });

    it('should recognize missing biometrics', () => {
      [1, 11, 12, 14, 15].forEach((promptCode) => {
        expect(getBiometricLoginErrorReason(promptError(promptCode))).toBe('notAvailable');
      });
    });

    it('should treat other codes of the prompt as failed biometrics', () => {
      expect(getBiometricLoginErrorReason(promptError(2))).toBe('authFailed');
    });

    it('should not guess when the message carries no code of the prompt', () => {
      expect(getBiometricLoginErrorReason({
        code: 'E_CRYPTO_FAILED',
        message: 'Wrapped error: Key permanently invalidated',
      })).toBe('unknown');
    });
  });

  it('should report anything else as unknown', () => {
    expect(getBiometricLoginErrorReason({ code: 'ETIMEDOUT' })).toBe('unknown');
    expect(getBiometricLoginErrorReason({ message: 'Network request failed' })).toBe('unknown');
    expect(getBiometricLoginErrorReason()).toBe('unknown');
  });
});
