import React from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { Card, ContextMenu } from '@shopgate/engage/components';

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
  header: css({
    display: 'flex',
    flexDirection: 'row',
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
};

/**
 * @returns {JSX}
 */
const ProfileAddressCard = ({ contact, deleteContact, editContact }) => (
  <Card className={styles.root}>
    <div className={styles.header}>
      <span className={styles.name}>
        {contact.middleName
          ? `${contact.firstName} ${contact.middleName} ${contact.lastName}`
          : `${contact.firstName} ${contact.lastName}`}
      </span>
      <ContextMenu>
        <ContextMenu.Item onClick={editContact}>
          {i18n.text('account.profile.address_book.context.edit')}
        </ContextMenu.Item>
        <ContextMenu.Item onClick={deleteContact}>
          {i18n.text('account.profile.address_book.context.remove')}
        </ContextMenu.Item>
      </ContextMenu>
    </div>
    {contact.emailAddress ? (
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
    {contact.mobile ? (
      <span className={styles.others}>
        {contact.mobile}
      </span>
    ) : null}
    {contact.isDefaultBilling ? (
      <span className={styles.defaultLabel}>
        {i18n.text('account.profile.address_book.default_billing')}
      </span>
    ) : null}
    {contact.isDefaultShipping ? (
      <span className={styles.defaultLabel}>
        {i18n.text('account.profile.address_book.default_shipping')}
      </span>
    ) : null}
  </Card>
);

ProfileAddressCard.propTypes = {
  contact: PropTypes.shape().isRequired,
  deleteContact: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
};

export default ProfileAddressCard;
