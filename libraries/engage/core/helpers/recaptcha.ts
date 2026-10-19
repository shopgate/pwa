import { appConfig } from '@shopgate/engage';

const READY_TIMEOUT = 5000;
const READY_CHECK_INTERVAL = 100;

/**
 * The part of the reCAPTCHA Enterprise API that is used to create tokens.
 */
interface RecaptchaEnterprise {
  /**
   * Invokes the callback as soon as the API can be used.
   */
  ready(callback: () => void): void;
  /**
   * Creates a token for the site key. The action name is assigned to the token.
   */
  execute(siteKey: string, options: { action: string }): Promise<string>;
}

/**
 * The reCAPTCHA settings from the app config.
 */
interface RecaptchaConfig {
  /**
   * Whether reCAPTCHA is turned on for the shop.
   */
  enabled?: boolean;
  /**
   * The site key of the Google Cloud project.
   */
  googleCloudSiteKey?: string | null;
}

declare global {
  interface Window {
    /**
     * Set by the reCAPTCHA script once it's loaded.
     */
    grecaptcha?: {
      enterprise?: RecaptchaEnterprise;
    };
  }
}

/**
 * Waits until the reCAPTCHA script is loaded and ready.
 * @param timeout The time in milliseconds to wait for the script.
 * @returns The reCAPTCHA Enterprise API. Rejects when the script isn't available in time.
 */
const waitForRecaptcha = (timeout: number) => new Promise<RecaptchaEnterprise>((
  resolve,
  reject
) => {
  const startedAt = Date.now();

  const check = () => {
    const enterprise = window.grecaptcha?.enterprise;

    if (enterprise) {
      enterprise.ready(() => resolve(enterprise));
      return;
    }

    if (Date.now() - startedAt >= timeout) {
      reject(new Error('reCAPTCHA is not available'));
      return;
    }

    setTimeout(check, READY_CHECK_INTERVAL);
  };

  check();
});

/**
 * Creates a fresh reCAPTCHA token when reCAPTCHA is configured for the shop.
 * @param action The action name that is assigned to the token, e.g. `login`.
 * @param timeout The time in milliseconds to wait for the reCAPTCHA script when it isn't loaded
 * yet. With `0` the token is only created when the script is already there.
 * @returns The token, or `undefined` when reCAPTCHA is turned off or no token could be created.
 */
export const getRecaptchaToken = async (
  action: string,
  timeout = READY_TIMEOUT
): Promise<string | undefined> => {
  const { enabled, googleCloudSiteKey } = (appConfig as { recaptcha?: RecaptchaConfig })
    .recaptcha || {};

  if (!enabled || !googleCloudSiteKey) {
    return undefined;
  }

  try {
    const enterprise = await waitForRecaptcha(timeout);
    return await enterprise.execute(googleCloudSiteKey, { action });
  } catch (error) {
    return undefined;
  }
};
