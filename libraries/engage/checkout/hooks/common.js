import React from 'react';
import Context from '../providers/CheckoutProvider.context';

/**
 * Returns the value of the checkout provider state.
 * @returns {Object}
 */
export const useCheckoutContext = () => React.useContext(Context);
