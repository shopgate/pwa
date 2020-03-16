// @flow
import React from 'react';
import { I18n, PhoneIcon } from '@shopgate/engage/components';
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
    <a href={`tel:${phone}`}>
      <StoreDetailsLine icon={PhoneIcon}>
        <div className={detailsPrimary}>{phone}</div>
        <I18n.Text string="locations.phone" className={detailsSecondary} />
      </StoreDetailsLine>
    </a>
  );
}

StorePhoneNumber.defaultProps = {
  phone: null,
};
