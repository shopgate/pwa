import { OS_ANDROID, OS_IOS } from '@shopgate/pwa-common/constants/Device';

/**
 * Generates a review app deep link based on the given provider
 * @param {string} bundleId app bundle id
 * @param {OS_ANDROID | OS_IOS} platform the name of the OS platform
 * @return {string | null}
 */
export function generateReviewLink(bundleId, platform) {
  if (!bundleId) {
    return null;
  }

  switch (platform) {
    case OS_IOS: {
      return `https://itunes.apple.com/app/id${bundleId}?action=write-review`;
    }
    case OS_ANDROID: {
      return `https://market.android.com/details?id=${bundleId}`;
    }
    default: {
      return null;
    }
  }
}
