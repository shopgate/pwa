import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';

/**
 * CheckoutConfirmationShippedTo component
 * @returns {JSX}
 */
const CheckoutConfirmationShippedTo = ({ order, className }) => {
  const content = useMemo(() => {
    const shipping = order.addressSequences.find(address => address.type === 'shipping');

    if (!shipping) {
      return null;
    }

    const {
      firstName, lastName, address1, city, region, postalCode, orderSegment,
    } = shipping;

    const shippingMethodServiceLevel = orderSegment?.selectedShippingMethod?.serviceLevel?.name;

    const address = [
      `${firstName} ${lastName}`,
      `${address1 || ''}`,
      `${city ? `${city},` : ''} ${city && region ? region : ''} ${postalCode || ''}`,
    ].filter(Boolean).join('\n');

    return [
      {
        label: i18n.text('checkout.success.address'),
        text: address,
      },
      ...(shippingMethodServiceLevel ? {
        label: i18n.text('checkout.success.shipping_method'),
        text: shippingMethodServiceLevel,
      } : []),
    ];
  }, [order]);

  if (!content) {
    return null;
  }

  return (
    <CheckoutConfirmationSection
      title="checkout.success.shipped_to"
      content={content}
      className={className}
    />
  );
};

CheckoutConfirmationShippedTo.propTypes = {
  order: PropTypes.shape().isRequired,
  className: PropTypes.string,
};

CheckoutConfirmationShippedTo.defaultProps = {
  className: null,
};

export default CheckoutConfirmationShippedTo;
