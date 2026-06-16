import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { Link, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useProfileContext } from '../../../account/components/Profile/Profile.provider';
import Section from './CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';
import {
  GUEST_CHECKOUT_PATTERN,
  CHECKOUT_ADDRESS_BOOK_PATH,
  CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN,
} from '../../constants/routes';
import { ADDRESS_TYPE_BILLING, ADDRESS_TYPE_SHIPPING } from '../../constants';
import iso3166 from '../../../components/Form/Builder/helpers/iso-3166-2';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(0, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    margin: '8px 0',
  },
  link: {
    textTransform: 'uppercase',
  },
}));

/**
 * CheckoutAddress
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CheckoutAddress = ({ type }) => {
  const { classes } = useStyles();
  const {
    billingAddress,
    shippingAddress,
    orderReserveOnly,
    isShippingAddressSelectionEnabled,
    isGuestCheckout,
  } = useCheckoutContext();

  const { contacts = [] } = useProfileContext() || {};

  const address = useMemo(
    () => (type === ADDRESS_TYPE_BILLING ? billingAddress : shippingAddress),
    [billingAddress, shippingAddress, type]
  );

  const headline = useMemo(() => {
    if (type === ADDRESS_TYPE_BILLING && isGuestCheckout && orderReserveOnly) {
      return 'checkout.billing.headline_reserve';
    }

    return `checkout.${type}.headline`;
  }, [isGuestCheckout, orderReserveOnly, type]);

  const editLink = useMemo(() => {
    if (!address) {
      return null;
    }

    if (isGuestCheckout) {
      return `${GUEST_CHECKOUT_PATTERN}?edit=${type}`;
    }

    return `${CHECKOUT_ADDRESS_BOOK_PATH}/${type}`;
  }, [address, isGuestCheckout, type]);

  const editLabel = useMemo(() => {
    if (isGuestCheckout) {
      return undefined;
    }

    return `checkout.${type}.change`;
  }, [isGuestCheckout, type]);

  const selectAddressLink = useMemo(() => {
    if (!address && (!Array.isArray(contacts) || contacts.length === 0)) {
      return `${CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN}`.replace(':type', type);
    }

    return `${CHECKOUT_ADDRESS_BOOK_PATH}/${type}`;
  }, [address, contacts, type]);

  if (isGuestCheckout && !address) {
    return null;
  }

  // Do not try to render the shipping address when it's not a directShip order
  if (type === ADDRESS_TYPE_SHIPPING && !isShippingAddressSelectionEnabled) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Section
        className={classes.card}
        title={headline}
        editLink={editLink}
        editLabel={editLabel}
      >
        { address ? (
          <>
            <Typography variant="body1" component="span">
              {address.middleName?.length
                ? `${address.firstName} ${address.middleName} ${address.lastName}`
                : `${address.firstName} ${address.lastName}`}
            </Typography>
            { (type === ADDRESS_TYPE_BILLING && isGuestCheckout && orderReserveOnly) && (
              <>
                <Typography variant="body1" component="span">{address.emailAddress}</Typography>
                <Typography variant="body1" component="span">{address.mobile}</Typography>
              </>
            )}
            <Typography variant="body1" component="span">{address.address1}</Typography>
            {address.address2?.length ? (
              <Typography variant="body1" component="span">{address.address2}</Typography>
            ) : null}
            {address.address3?.length ? (
              <Typography variant="body1" component="span">{address.address3}</Typography>
            ) : null}
            {address.address4?.length ? (
              <Typography variant="body1" component="span">{address.address4}</Typography>
            ) : null}
            {address.postalCode ||
              address.region ||
              address.city ||
              address.country ? (
                <Typography variant="body1" component="span">
                  {i18n.text(`checkout.${type}.address`, {
                    postalCode: address.postalCode || '',
                    region: iso3166?.[address.country]?.divisions?.[address.region] || address.region || '',
                    city: address.city || '',
                    country: address.country || '',
                  })}
                </Typography>
              ) : null}
          </>
        ) : (
          <Link href={selectAddressLink} className={classes.link}>
            <Typography variant="body2" color="primary" component="span" align="center">
              {i18n.text(`checkout.${type}.select_address`)}
            </Typography>
          </Link>)}
      </Section>
    </div>
  );
};

CheckoutAddress.propTypes = {
  type: PropTypes.string,
};

CheckoutAddress.defaultProps = {
  type: ADDRESS_TYPE_BILLING,
};

export default CheckoutAddress;
