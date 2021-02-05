import { hot } from 'react-hot-loader/root';
import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/engage';
import { Link } from '@shopgate/engage/components';
import { useProfileContext } from '../../../account/components/Profile/Profile.provider';
import Section from './CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';
import {
  GUEST_CHECKOUT_PATTERN,
  CHECKOUT_ADDRESS_BOOK_PATH,
  CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN,
} from '../../constants/routes';

import { ADDRESS_TYPE_BILLING, ADDRESS_TYPE_SHIPPING } from '../../constants';

const { variables } = themeConfig;

export const styles = {
  root: css({
    padding: `0 ${variables.gap.big}px ${variables.gap.big}px`,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  }).toString(),
  card: css({
    display: 'flex',
    flexDirection: 'column',
    fontSize: 15,
    margin: '8px 0',
  }).toString(),
  link: css({
    fontSize: '0.875rem',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    textAlign: 'center',
  }).toString(),
};

/**
 * CheckoutAddress
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CheckoutAddress = ({ type, guestCheckout }) => {
  const {
    billingAddress,
    shippingAddress,
    orderReserveOnly,
    isShippingAddressSelectionEnabled,
  } = useCheckoutContext();

  const { contacts = [] } = useProfileContext() || {};

  const address = useMemo(
    () => (type === ADDRESS_TYPE_BILLING ? billingAddress : shippingAddress),
    [billingAddress, shippingAddress, type]
  );

  const headline = useMemo(() => {
    if (type === ADDRESS_TYPE_BILLING && guestCheckout && orderReserveOnly) {
      return 'checkout.billing.headline_reserve';
    }

    return `checkout.${type}.headline`;
  }, [guestCheckout, orderReserveOnly, type]);

  const editLink = useMemo(() => {
    if (!address) {
      return null;
    }

    if (type === ADDRESS_TYPE_BILLING) {
      if (guestCheckout) {
        return `${GUEST_CHECKOUT_PATTERN}?edit=1`;
      }

      return `${CHECKOUT_ADDRESS_BOOK_PATH}/${ADDRESS_TYPE_BILLING}`;
    }

    return `${CHECKOUT_ADDRESS_BOOK_PATH}/${ADDRESS_TYPE_SHIPPING}`;
  }, [address, guestCheckout, type]);

  const editLabel = useMemo(() => {
    if (guestCheckout) {
      return undefined;
    }

    return `checkout.${type}.change`;
  }, [guestCheckout, type]);

  const selectAddressLink = useMemo(() => {
    if (!address && (!Array.isArray(contacts) || contacts.length === 0)) {
      return `${CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN}`.replace(':type', type);
    }

    return `${CHECKOUT_ADDRESS_BOOK_PATH}/${type}`;
  }, [address, contacts, type]);

  // Do not try to render the shipping address when it's not a directShip order
  if (type === ADDRESS_TYPE_SHIPPING && (guestCheckout || !isShippingAddressSelectionEnabled)) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Section
        className={styles.card}
        title={headline}
        editLink={editLink}
        editLabel={editLabel}
      >
        { address ? (
          <Fragment>
            <span>
              {address.middleName?.length
                ? `${address.firstName} ${address.middleName} ${address.lastName}`
                : `${address.firstName} ${address.lastName}`
              }
            </span>
            { (type === ADDRESS_TYPE_BILLING && guestCheckout && orderReserveOnly) && (
              <Fragment>
                <span>{address.emailAddress}</span>
                <span>{address.mobile}</span>
              </Fragment>
            )}
            <span>{address.address1}</span>
            {address.address2?.length ? (
              <span>{address.address2}</span>
            ) : null}
            {address.address3?.length ? (
              <span>{address.address3}</span>
            ) : null}
            {address.address4?.length ? (
              <span>{address.address4}</span>
            ) : null}
            {address.postalCode ||
              address.region ||
              address.city ||
              address.country ? (
                <span>
                  {i18n.text(`checkout.${type}.address`, {
                    postalCode: address.postalCode || '',
                    region: address.region || '',
                    city: address.city || '',
                    country: address.country || '',
                  })}
                </span>
              ) : null}
          </Fragment>
        ) : (
          <Link href={selectAddressLink} className={styles.link}>
            {i18n.text(`checkout.${type}.select_address`)}
          </Link>)}
      </Section>
    </div>
  );
};

CheckoutAddress.propTypes = {
  guestCheckout: PropTypes.bool,
  type: PropTypes.string,
};

CheckoutAddress.defaultProps = {
  guestCheckout: false,
  type: ADDRESS_TYPE_BILLING,
};

export default hot(CheckoutAddress);
