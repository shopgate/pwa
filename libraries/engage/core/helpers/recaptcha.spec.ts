import { appConfig } from '@shopgate/engage';
import { getRecaptchaToken } from './recaptcha';

jest.mock('@shopgate/engage', () => ({
  appConfig: {},
}));

const config = appConfig as { recaptcha?: unknown };

describe('getRecaptchaToken()', () => {
  const execute = jest.fn().mockResolvedValue('token');
  const enterprise = {
    ready: (callback: () => void) => callback(),
    execute,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    config.recaptcha = {
      enabled: true,
      googleCloudSiteKey: 'site-key',
    };
    window.grecaptcha = { enterprise };
  });

  afterEach(() => {
    delete window.grecaptcha;
  });

  it('should resolve with a token for the action', async () => {
    await expect(getRecaptchaToken('login')).resolves.toBe('token');
    expect(execute).toHaveBeenCalledWith('site-key', { action: 'login' });
  });

  it('should resolve with undefined when reCAPTCHA is turned off', async () => {
    config.recaptcha = {
      enabled: false,
      googleCloudSiteKey: 'site-key',
    };

    await expect(getRecaptchaToken('login')).resolves.toBeUndefined();
    expect(execute).not.toHaveBeenCalled();
  });

  it('should resolve with undefined when no site key is configured', async () => {
    config.recaptcha = {
      enabled: true,
      googleCloudSiteKey: null,
    };

    await expect(getRecaptchaToken('login')).resolves.toBeUndefined();
  });

  it('should resolve with undefined when the token can not be created', async () => {
    execute.mockRejectedValueOnce(new Error('failed'));

    await expect(getRecaptchaToken('login')).resolves.toBeUndefined();
  });

  it('should wait for the script when it is not loaded yet', async () => {
    jest.useFakeTimers();
    delete window.grecaptcha;

    const promise = getRecaptchaToken('login');
    jest.advanceTimersByTime(300);
    window.grecaptcha = { enterprise };
    jest.advanceTimersByTime(100);

    await expect(promise).resolves.toBe('token');
  });

  it('should not wait for the script when the timeout is 0', async () => {
    delete window.grecaptcha;

    await expect(getRecaptchaToken('login', 0)).resolves.toBeUndefined();
    expect(execute).not.toHaveBeenCalled();
  });

  it('should resolve with undefined when the script does not load in time', async () => {
    jest.useFakeTimers();
    delete window.grecaptcha;

    const promise = getRecaptchaToken('login');
    jest.advanceTimersByTime(5000);

    await expect(promise).resolves.toBeUndefined();
    expect(execute).not.toHaveBeenCalled();
  });
});
