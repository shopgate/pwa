import { useContext } from 'react';
import RegistrationContext from '../providers/RegistrationProvider.context';

/**
 * Returns the value of the checkout provider state.
 * @returns {Object}
 */
export const useRegistration = () => useContext(RegistrationContext);
