import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/engage';
import Section from './CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';
import { CHECKOUT_BILLING_PATTERN, GUEST_CHECKOUT_PATTERN } from '../../constants/routes';

const { variables } = themeConfig;

const styles = {
  root: css({
    padding: variables.gap.big,
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  }).toString(),
  card: css({
    display: 'flex',
    flexDirection: 'column',
    fontSize: 15,
    margin: '8px 0 12px 0',
  }).toString(),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const Billing = ({ guestCheckout }) => {
  const { billingAddress, orderReserveOnly } = useCheckoutContext();

  const headline = useMemo(() => {
    if (guestCheckout && orderReserveOnly) {
      return 'checkout.billing.headline_reserve';
    }

    return 'checkout.billing.headline';
  }, [guestCheckout, orderReserveOnly]);

  return (
    <div className={styles.root}>
      <Section
        className={styles.card}
        title={headline}
        editLink={guestCheckout ? `${GUEST_CHECKOUT_PATTERN}?edit=1` : CHECKOUT_BILLING_PATTERN}
      >
        <span>
          {billingAddress.middleName?.length
            ? `${billingAddress.firstName} ${billingAddress.middleName} ${billingAddress.lastName}`
            : `${billingAddress.firstName} ${billingAddress.lastName}`
          }
        </span>
        { (guestCheckout && orderReserveOnly) && (
          <Fragment>
            <span>{billingAddress.emailAddress}</span>
            <span>{billingAddress.mobile}</span>
          </Fragment>
        )}
        <span>{billingAddress.address1}</span>
        {billingAddress.address2?.length ? (
          <span>{billingAddress.address2}</span>
        ) : null}
        {billingAddress.address3?.length ? (
          <span>{billingAddress.address3}</span>
        ) : null}
        {billingAddress.address4?.length ? (
          <span>{billingAddress.address4}</span>
        ) : null}
        {billingAddress.postalCode ||
          billingAddress.region ||
          billingAddress.city ||
          billingAddress.country ? (
            <span>
              {i18n.text('checkout.billing.address', {
                postalCode: billingAddress.postalCode || '',
                region: billingAddress.region || '',
                city: billingAddress.city || '',
                country: billingAddress.country || '',
              })}
            </span>
          ) : null}
      </Section>
    </div>
  );
};

Billing.propTypes = {
  guestCheckout: PropTypes.bool,
};

Billing.defaultProps = {
  guestCheckout: false,
};

export default Billing;
