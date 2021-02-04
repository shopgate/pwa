import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import {
  getCheckoutBillingAddress,
  getCheckoutShippingAddress,
} from '@shopgate/engage/checkout/selectors/order';
import { i18n, historyPush } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { RippleButton, ResponsiveContainer } from '@shopgate/engage/components';
import { ResponsiveBackButton } from '../ResponsiveBackButton';
import AddressCard from '../../../account/components/Profile/ProfileAddressCard';
import { useProfileContext } from '../../../account/components/Profile/Profile.provider';
import { useAddressBook } from '../../hooks/common';
import {
  ADDRESS_TYPE_SHIPPING,
  ADDRESS_TYPE_BILLING,
  CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN,
} from '../../constants';

/**
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  shippingAddress: getCheckoutShippingAddress(state),
  billingAddress: getCheckoutBillingAddress(state),
});

/**
 * @param {Object} dispatch Dispatch
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  push: props => dispatch(historyPush(props)),
});

const styles = {
  title: css({
    color: 'var(--color-text-high-emphasis)',
    lineHeight: 2.5,
    fontSize: 17,
    fontWeight: '600',
  }).toString(),
  container: css({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -4,
    padding: 16,
  }).toString(),
  headline: css({
    padding: 16,
    fontSize: '2.125rem',
    fontWeight: 'normal',
    margin: 0,
    lineHeight: '2.25rem',
  }).toString(),
  button: css({
    '&&': {
      marginTop: 8,
      marginRight: 16,
      backgroundColor: 'var(--color-primary)',
      borderRadius: 5,
      fontSize: 14,
      textTransform: 'none',
      padding: 0,
      [responsiveMediaQuery('<md', { webOnly: false })]: {
        width: '100%',
        marginRight: 0,
      },
    },
  }).toString(),
  ripple: css({
    padding: '8px 16px',
  }).toString(),
  actions: css({
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: '0 16px 16px',
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      flex: 1,
    },
  }).toString(),
};

/**
 * @returns {JSX}
 */
const AddressList = ({
  push, shippingAddress, billingAddress,
}) => {
  const { contacts, deleteContact, editContact } = useProfileContext();
  const { type, updateOrderWithContact } = useAddressBook();

  const title = useMemo(() => {
    if ([ADDRESS_TYPE_SHIPPING, ADDRESS_TYPE_BILLING].includes(type)) {
      return i18n.text(`titles.checkout_addresses_${type}`);
    }

    return '';
  }, [type]);

  const selectedContactId = useMemo(() => {
    if (type === ADDRESS_TYPE_SHIPPING) {
      return shippingAddress?.customerContactId || null;
    }

    if (type === ADDRESS_TYPE_BILLING) {
      return billingAddress?.customerContactId || null;
    }

    return null;
  }, [billingAddress, shippingAddress, type]);

  return (
    <div>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <ResponsiveBackButton />
        <h1 className={styles.headline}>
          {title}
        </h1>
      </ResponsiveContainer>
      <div className={styles.container}>
        {contacts && contacts.map(contact => (
          <AddressCard
            key={contact.id}
            contact={contact}
            selected={contact.id === selectedContactId}
            selectContact={() => updateOrderWithContact(contact)}
            deleteContact={() => deleteContact(contact.id)}
            editContact={(
            ) => editContact(contact)}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <RippleButton
          className={styles.button}
          rippleClassName={styles.ripple}
          type="primary"
          onClick={() => push({
            pathname: `${CHECKOUT_ADDRESS_BOOK_CONTACT_PATTERN}`.replace(':type', type),
          })}
        >
          {i18n.text('account.profile.address_book.add')}
        </RippleButton>
      </div>
    </div>
  );
};

AddressList.propTypes = {
  push: PropTypes.func.isRequired,
  billingAddress: PropTypes.shape(),
  shippingAddress: PropTypes.shape(),
};

AddressList.defaultProps = {
  shippingAddress: null,
  billingAddress: null,
};
export default connect(mapStateToProps, mapDispatchToProps)(AddressList);
