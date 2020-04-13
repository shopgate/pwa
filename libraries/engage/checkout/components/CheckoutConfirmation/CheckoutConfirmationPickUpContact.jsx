import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '../../../core/helpers/i18n';
import CheckoutConfirmationSection from './CheckoutConfirmationSection';

/**
 * CheckoutConfirmationPickUpContact component
 * @returns {JSX}
 */
const CheckoutConfirmationPickUpContact = ({ order }) => {
  const content = useMemo(() => {
    const pickup = order.addressSequences.find(address => address.type === 'pickup');
    const {
      firstName, lastName, phone, mobile, emailAddress,
    } = pickup;

    const entries = [{
      label: i18n.text('checkout.success.name'),
      text: `${firstName} ${lastName}`,
    }];

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

    if (emailAddress) {
      entries.push({
        label: i18n.text('checkout.success.email_address'),
        text: emailAddress,
      });
    }

    return entries;
  }, [order]);

  return (
    <CheckoutConfirmationSection title="checkout.success.pick_up_contact" content={content} />
  );
};

CheckoutConfirmationPickUpContact.propTypes = {
  order: PropTypes.shape().isRequired,
};

export default CheckoutConfirmationPickUpContact;
