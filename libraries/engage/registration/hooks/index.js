import { useContext } from 'react';
import RegistrationContext from '../providers/RegistrationProvider.context';
import GuestRegistrationContext from '../providers/GuestRegistrationProvider.context';

/**
 * Returns the value of the checkout provider state.
 * @param {bool} isGuest Whether the registration is a guest registration
 * @returns {Object}
 */
export const useRegistration = (isGuest = false) =>
  useContext(isGuest ? GuestRegistrationContext : RegistrationContext);
