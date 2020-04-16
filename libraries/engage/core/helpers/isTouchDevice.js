/**
 * Checks if the device is a touch device.
 * @returns {boolean}
 */
export const isTouchDevice = () => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
};
