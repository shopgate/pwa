import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';

/**
 * CheckoutConfirmationOrderContact component
 * @returns {JSX}
 */
const CheckoutConfirmationOrderContact = ({ order }) => {
  const content = useMemo(() => {
    const pickup = order.addressSequences.find(address => address.type === 'billing');
    const {
      firstName, lastName, phone, mobile, emailAddress,
    } = pickup;

    const entries = [{
      label: i18n.text('checkout.success.name'),
      text: `${firstName} ${lastName}`,
    }];

    if (emailAddress) {
      entries.push({
        label: i18n.text('checkout.success.email_address'),
        text: emailAddress,
      });
    }

    if (mobile) {
      entries.push({
        label: i18n.text('checkout.success.phone_number'),
        text: mobile,
      });
    } else if (phone) {
      entries.push({
        label: i18n.text('checkout.success.phone_number'),
        text: phone,
      });
    }

    return entries;
  }, [order]);

  return (
    <CheckoutConfirmationSection title="checkout.success.order_contact" content={content} />
  );
};

CheckoutConfirmationOrderContact.propTypes = {
  order: PropTypes.shape().isRequired,
};

export default CheckoutConfirmationOrderContact;
