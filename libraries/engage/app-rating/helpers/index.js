/**
 * Generates a review app deep link based on the given provider
 * @param {string} bundleId app bundle id
 * @param {'android' | 'ios'} provider the name of the provider
 * @return {string | null}
 */
export function generateReviewLink(bundleId, provider) {
  if (!bundleId) {
    return null;
  }

  switch (provider) {
    case 'ios': {
      return `https://itunes.apple.com/app/id${bundleId}?action=write-review`;
    }
    case 'android': {
      return `https://market.android.com/details?id=${bundleId}`;
    }
    default: {
      return null;
    }
  }
}
