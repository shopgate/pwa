import React from 'react';
import CheckoutContext from '../providers/CheckoutProvider.context';
import GuestRegistrationContext from '../providers/GuestRegistrationProvider.context';
import StripeContext from '../providers/StripeProvider.context';

/**
 * Returns the value of the checkout provider state.
 * @returns {Object}
 */
export const useCheckoutContext = () => React.useContext(CheckoutContext);

/**
 * Returns the value of the guest registration provider state.
 * @returns {Object}
 */
export const useGuestRegistration = () => React.useContext(GuestRegistrationContext);

/**
 * Returns the value of the stripe provider state.
 * @returns {Object}
 */
export const useStripeContext = () => React.useContext(StripeContext);
