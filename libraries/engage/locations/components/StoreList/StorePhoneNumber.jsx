import React from 'react';
import PropTypes from 'prop-types';
import { I18n, PhoneIcon, Link } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { StoreDetailsLine } from './StoreDetailsLine';
import { detailsPrimary, detailsSecondary } from './Store.style';

/**
 * Renders the store's phone number.
 * @param {Object} props The component props.
 * @param {string} props.phone The store's phone number.
 * @returns {JSX.Element}
 */
export function StorePhoneNumber({ phone }) {
  if (!phone) {
    return null;
  }

  return (
    <Link
      href={`tel:${phone}`}
      role="button"
      aria-label={`${i18n.text('locations.phone')}: ${phone}`}
    >
      <StoreDetailsLine icon={PhoneIcon} linked>
        <div className={detailsPrimary}>{phone}</div>
        <I18n.Text string="locations.phone" className={detailsSecondary} />
      </StoreDetailsLine>
    </Link>
  );
}

StorePhoneNumber.propTypes = {
  phone: PropTypes.string,
};

StorePhoneNumber.defaultProps = {
  phone: null,
};
