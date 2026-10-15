/**
 * Why a call to the keychain of the app or the biometric login failed. The reasons are explained
 * at `getBiometricLoginErrorReason`.
 */
export type BiometricLoginErrorReason =
  | 'invalidCredentials'
  | 'canceled'
  | 'interrupted'
  | 'lockout'
  | 'notAvailable'
  | 'authFailed'
  | 'invalidated'
  | 'unknown';

/**
 * The error details the app passes on when a call to its keychain fails.
 */
export interface BiometricLoginErrorDetails {
  /**
   * The error code of the app, of the keychain library or of the login pipeline.
   */
  code?: string;
  /**
   * The error message. On Android it carries the code of the biometric prompt.
   */
  message?: string;
}

/**
 * The codes iOS reports as OSStatus of the keychain.
 */
const iosReasons: Record<string, BiometricLoginErrorReason> = {
  '-128': 'canceled',
  '-25293': 'authFailed',
  '-25300': 'invalidated',
  '-25308': 'interrupted',
};

/**
 * The error codes of the biometric prompt of Android, which the keychain library puts into the
 * message as `code: <number>, msg: <text>`.
 */
const androidReasons: Record<number, BiometricLoginErrorReason> = {
  1: 'notAvailable',
  5: 'interrupted',
  7: 'lockout',
  9: 'lockout',
  10: 'canceled',
  11: 'notAvailable',
  12: 'notAvailable',
  13: 'canceled',
  14: 'notAvailable',
  15: 'notAvailable',
};

/**
 * Reads the code of the biometric prompt of Android from an error message of the keychain
 * library. The text after the code is in the language of the device, so only the number is used.
 * @param message The error message.
 * @returns The code, or null when the message doesn't carry one.
 */
const getAndroidPromptCode = (message?: string): number | null => {
  const match = /^code: (\d+)/.exec(message ?? '');

  return match ? Number(match[1]) : null;
};

/**
 * Determines why a call to the keychain of the app or the biometric login failed. The app passes
 * the errors of the keychain library and of the login pipeline on unchanged, so the codes differ
 * between iOS and Android. The reasons:
 * - `invalidCredentials`: the backend rejected the stored credentials.
 * - `canceled`: the user canceled the prompt. Android also reports switching apps this way.
 * - `interrupted`: the system ended the prompt, e.g. because the screen was locked.
 * - `lockout`: biometrics are locked after too many failed attempts (Android).
 * - `notAvailable`: the device has no usable biometrics at the moment (Android).
 * - `authFailed`: the biometrics weren't accepted. On iOS this also covers an interrupted prompt
 *   and a lockout, which iOS doesn't tell apart.
 * - `invalidated`: the stored credentials can't be read anymore, e.g. after the biometrics of the
 *   device changed.
 * - `unknown`: anything else, e.g. network errors or other errors of the backend.
 * @param error The error details of the app.
 * @param error.code The error code.
 * @param error.message The error message.
 * @returns The reason.
 */
export const getBiometricLoginErrorReason = ({
  code,
  message,
}: BiometricLoginErrorDetails = {}): BiometricLoginErrorReason => {
  if (code === 'EINVALIDCREDENTIALS') {
    return 'invalidCredentials';
  }

  if (code === 'BIOMETRIC_AUTH_FAILED') {
    return 'invalidated';
  }

  if (code && iosReasons[code]) {
    return iosReasons[code];
  }

  if (code === 'E_CRYPTO_FAILED') {
    const promptCode = getAndroidPromptCode(message);

    if (promptCode === null) {
      return 'unknown';
    }

    return androidReasons[promptCode] ?? 'authFailed';
  }

  return 'unknown';
};
