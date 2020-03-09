const BASE_URL = 'https://www.google.com/maps';

/**
 * Generates a universal link to google maps that shows the direction to given address.
 * @param {Object} address The address object.
 * @param {string} address.street Street name and number
 * @param {string} address.city City name
 * @param {string} address.postalCode Postal code.
 * @returns {string}
 */
export const generateGoogleMapsDirectionsUrl = (address = {}) => {
  const mapDestination = encodeURIComponent(`${address.street}, ${address.city} ${address.postalCode}`);
  const url = `${BASE_URL}/dir/?api=1&destination=${mapDestination}`;
  return url;
};
