import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { I18n, PhoneIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { StoreDetailsLine } from './StoreDetailsLine';

const useStyles = makeStyles()({
  detailsPrimary: {
    margin: 0,
    color: 'var(--color-primary)',
    lineHeight: '1.375rem',
  },
  detailsSecondary: {
    color: 'var(--color-text-medium-emphasis)',
    fontSize: '0.75rem',
  },
});

/**
 * Renders the store's phone number.
 * @param {Object} props The component props.
 * @param {string} props.phone The store's phone number.
 * @returns {JSX.Element}
 */
export function StorePhoneNumber({ phone }) {
  const { classes } = useStyles();
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
        <div className={classes.detailsPrimary} aria-hidden>{phone}</div>
        <I18n.Text string="locations.phone" className={classes.detailsSecondary} aria-hidden />
      </StoreDetailsLine>
    </a>
  );
}

StorePhoneNumber.propTypes = {
  phone: PropTypes.string,
};

StorePhoneNumber.defaultProps = {
  phone: null,
};
