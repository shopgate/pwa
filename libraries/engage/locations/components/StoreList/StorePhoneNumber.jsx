// @flow
import React from 'react';
import { I18n, PhoneIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { StoreDetailsLine } from './StoreDetailsLine';
import { detailsPrimary, detailsSecondary } from './Store.style';

type Props = {
  phone?: string,
}

/**
 * Renders the store's phone number.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function StorePhoneNumber({ phone }: Props) {
  if (!phone) {
    return null;
  }

  return (
    <a
      href={`tel:${phone}`}
      aria-label={`${i18n.text('locations.phone')}: ${phone}`}
      tabIndex={0}
    >
      <StoreDetailsLine icon={PhoneIcon} linked>
        <div className={detailsPrimary} aria-hidden>{phone}</div>
        <I18n.Text string="locations.phone" className={detailsSecondary} aria-hidden />
      </StoreDetailsLine>
    </a>
  );
}

StorePhoneNumber.defaultProps = {
  phone: null,
};
