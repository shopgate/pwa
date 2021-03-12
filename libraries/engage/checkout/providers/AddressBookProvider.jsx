import React, {
  useCallback, useMemo, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  LoadingProvider, historyPopToRoute as historyPopToRouteAction, useRoute,
} from '@shopgate/engage/core';
import {
  getCheckoutOrder,
  getCheckoutBillingAddress,
  getCheckoutShippingAddress,
} from '@shopgate/engage/checkout/selectors/order';
import {
  updateCheckoutOrder as updateOrder,
  fetchCheckoutOrder as fetchOrder,
} from '@shopgate/engage/checkout/actions';
import Context from './AddressBookProvider.context';
import {
  ADDRESS_TYPE_BILLING,
  ADDRESS_TYPE_SHIPPING,
  CHECKOUT_PATTERN,
} from '../constants';

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
const makeMapStateToProp = () => state => ({
  order: getCheckoutOrder(state),
  billingAddress: getCheckoutBillingAddress(state),
  shippingAddress: getCheckoutShippingAddress(state),
});

const mapDispatchToProps = {
  updateCheckoutOrder: updateOrder,
  fetchCheckoutOrder: fetchOrder,
  historyPopToRoute: historyPopToRouteAction,
};

/**
 * AddressBookProvider
 * @param {Object} props The component props
 * @returns {JSX}
 */
const AddressBookProvider = ({
  children,
  order,
  billingAddress,
  shippingAddress,
  updateCheckoutOrder,
  fetchCheckoutOrder,
  historyPopToRoute,
}) => {
  const [isLoading, setLoading] = useState(false);
  const { pathname, id: routeId, params: { type = ADDRESS_TYPE_BILLING } } = useRoute();

  const popToCheckout = useCallback(() => {
    historyPopToRoute({
      pattern: CHECKOUT_PATTERN,
      routeId,
    });
  }, [historyPopToRoute, routeId]);

  /**
   * @param {Array} addressSequences Address sequences
   * @returns {Array}
   */
  const createAddressSequenceIndexes = (addressSequences) => {
    let primaryBillToAddressSequenceIndex = addressSequences
      .findIndex(address => address.type === 'billing');
    let primaryShipToAddressSequenceIndex = addressSequences
      .findIndex(address => address.type === 'shipping');

    primaryBillToAddressSequenceIndex =
      primaryBillToAddressSequenceIndex !== -1
        ? primaryBillToAddressSequenceIndex
        : undefined;
    primaryShipToAddressSequenceIndex =
      primaryShipToAddressSequenceIndex !== -1
        ? primaryShipToAddressSequenceIndex
        : undefined;

    return {
      primaryBillToAddressSequenceIndex,
      primaryShipToAddressSequenceIndex,
    };
  };

  const updateOrderWithContact = useCallback(async (contactId, gotoCheckout = true) => {
    setLoading(true);

    try {
      const addressSequences = [];

      if (type === ADDRESS_TYPE_BILLING) {
        addressSequences.push({
          customerContactId: contactId,
          type: 'billing',
        });
      } else if (billingAddress) {
        addressSequences.push({
          customerContactId: billingAddress.customerContactId,
          type: 'billing',
        });
      }

      if (type === ADDRESS_TYPE_SHIPPING) {
        addressSequences.push({
          customerContactId: contactId,
          type: 'shipping',
        });
      } else if (shippingAddress) {
        addressSequences.push({
          customerContactId: shippingAddress.customerContactId,
          type: 'shipping',
        });
      }
      await updateCheckoutOrder({
        addressSequences,
        ...createAddressSequenceIndexes(addressSequences),
      });

      if (gotoCheckout) {
        popToCheckout();
      }
    } catch (error) {
      // taken care by regular error handling.
    }

    setLoading(false);
  }, [billingAddress, popToCheckout, shippingAddress, type, updateCheckoutOrder]);

  const deleteContactFromOrder = useCallback(async (contactId) => {
    if (!Array.isArray(order?.addressSequences)) {
      return;
    }

    const addressSequences = order.addressSequences.reduce(
      (acc, { customerContactId, type: addressType }) => {
        if (customerContactId !== contactId) {
          acc.push({
            type: addressType,
            customerContactId,
          });
        }

        return acc;
      },
      []
    );

    try {
      await updateCheckoutOrder({
        addressSequences,
        ...createAddressSequenceIndexes(addressSequences),
      });
    } catch (error) {
      // taken care by regular error handling.
    }
  }, [order, updateCheckoutOrder]);

  useEffect(() => {
    if (isLoading) {
      LoadingProvider.setLoading(pathname);
    } else {
      LoadingProvider.resetLoading(pathname);
    }

    return () => {
      LoadingProvider.resetLoading(pathname);
    };
  }, [isLoading, pathname]);

  useEffect(() => {
    if (!order) {
      fetchCheckoutOrder();
    }
  }, [fetchCheckoutOrder, order]);

  const value = useMemo(() => ({
    isCheckout: true,
    updateOrderWithContact,
    deleteContactFromOrder,
    popToCheckout,
    type,
  }), [updateOrderWithContact, deleteContactFromOrder, popToCheckout, type]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

AddressBookProvider.propTypes = {
  fetchCheckoutOrder: PropTypes.func.isRequired,
  historyPopToRoute: PropTypes.func.isRequired,
  updateCheckoutOrder: PropTypes.func.isRequired,
  billingAddress: PropTypes.shape(),
  children: PropTypes.node,
  order: PropTypes.shape(),
  shippingAddress: PropTypes.shape(),
};

AddressBookProvider.defaultProps = {
  children: null,
  order: null,
  billingAddress: null,
  shippingAddress: null,
};

export default connect(makeMapStateToProp, mapDispatchToProps)(AddressBookProvider);
