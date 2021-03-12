import React from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { i18n } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import {
  useAddressBook,
  ADDRESS_TYPE_BILLING,
  ADDRESS_TYPE_SHIPPING,
} from '@shopgate/engage/checkout';
import { RippleButton, Card, ContextMenu } from '@shopgate/engage/components';

const styles = {
  root: css({
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    width: 'calc(50% - 16px)',
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      width: '100%',
    },
  }).toString(),
  contextMenu: css({
    marginRight: -8,
    marginBottom: 4,
  }).toString(),
  header: css({
    display: 'flex',
    flexDirection: 'row',
  }).toString(),
  body: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      flexDirection: 'column',
    },
  }).toString(),
  column: css({
    display: 'flex',
    flexDirection: 'column',
  }).toString(),
  selectButtonColumn: css({
    justifyContent: 'flex-end',
    paddingLeft: 8,
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      paddingLeft: 0,
    },
  }).toString(),
  name: css({
    color: 'var(--color-text-high-emphasis)',
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  }).toString(),
  others: css({
    color: 'var(--color-text-medium-emphasis)',
    fontSize: 16,
  }),
  defaultLabel: css({
    color: 'var(--color-text-low-emphasis)',
    fontSize: 15,
  }).toString(),
  selectedLabel: css({
    color: 'var(--color-text-high-emphasis)',
    fontSize: 15,
    fontWeight: 500,
    paddingTop: 8,
  }).toString(),
  button: css({
    '&&:disabled': {
      padding: '8px 0',
    },
    '&&': {
      marginTop: 8,
      borderRadius: 5,
      fontSize: 14,
      padding: 0,
      textTransform: 'none',
    },
  }).toString(),
  ripple: css({
    padding: '8px 16px',
  }).toString(),
};

/**
 * @returns {JSX}
 */
const ProfileAddressCard = ({
  contact, deleteContact, editContact, selectContact, selected,
}) => {
  const { isCheckout, type } = useAddressBook();

  return (
    <Card className={styles.root}>
      <div className={styles.header}>
        <span className={styles.name}>
          {contact.middleName
            ? `${contact.firstName} ${contact.middleName} ${contact.lastName}`
            : `${contact.firstName} ${contact.lastName}`}
        </span>
        <ContextMenu classes={{ container: styles.contextMenu }}>
          <ContextMenu.Item onClick={editContact}>
            {i18n.text('account.profile.address_book.context.edit')}
          </ContextMenu.Item>
          <ContextMenu.Item onClick={deleteContact}>
            {i18n.text('account.profile.address_book.context.remove')}
          </ContextMenu.Item>
        </ContextMenu>
      </div>
      <div className={styles.body}>
        <div className={styles.column}>
          {!isCheckout && contact.emailAddress ? (
            <span className={styles.others}>
              {contact.emailAddress}
            </span>
          ) : null}
          {contact.postalCode ||
        contact.region ||
        contact.city ||
        contact.country ? (
          <span className={styles.others}>
            {i18n.text('checkout.billing.address', {
              postalCode: contact.postalCode || '',
              region: contact.region || '',
              city: contact.city || '',
              country: contact.country || '',
            })}
          </span>
            ) : null}
          {contact.address1 ? (
            <span className={styles.others}>
              {contact.address1}
            </span>
          ) : null}
          {contact.address2 ? (
            <span className={styles.others}>
              {contact.address2}
            </span>
          ) : null}
          {contact.address3 ? (
            <span className={styles.others}>
              {contact.address3}
            </span>
          ) : null}
          {contact.address4 ? (
            <span className={styles.others}>
              {contact.address4}
            </span>
          ) : null}
          {!isCheckout && contact.mobile ? (
            <span className={styles.others}>
              {contact.mobile}
            </span>
          ) : null}
          {(!isCheckout || type === ADDRESS_TYPE_BILLING) && contact.isDefaultBilling ? (
            <span className={styles.defaultLabel}>
              {i18n.text('account.profile.address_book.default_billing')}
            </span>
          ) : null}
          {(!isCheckout || type === ADDRESS_TYPE_SHIPPING) && contact.isDefaultShipping ? (
            <span className={styles.defaultLabel}>
              {i18n.text('account.profile.address_book.default_shipping')}
            </span>
          ) : null}
        </div>
        <div className={classNames(styles.column, styles.selectButtonColumn)}>
          { isCheckout ? (
            <RippleButton
              className={styles.button}
              rippleClassName={styles.ripple}
              type="secondary"
              disabled={selected}
              onClick={selectContact}
            >
              {i18n.text(`account.profile.address_book.${selected ? 'selected' : 'select'}`)}
            </RippleButton>
          ) : null}
        </div>
      </div>

    </Card>
  );
};
ProfileAddressCard.propTypes = {
  contact: PropTypes.shape().isRequired,
  deleteContact: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
  selectContact: PropTypes.func,
  selected: PropTypes.bool,
};

ProfileAddressCard.defaultProps = {
  selectContact: null,
  selected: false,
};

export default ProfileAddressCard;
