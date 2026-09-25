import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { PhoneIcon, Typography } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { StoreDetailsLine } from './StoreDetailsLine';

const useStyles = makeStyles()(theme => ({
  detailsPrimary: {
    margin: 0,
    color: theme.palette.primary.main,
    lineHeight: '1.375rem',
  },
}));

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
        <Typography variant="caption" component="span" color="textSecondary" aria-hidden>
          {i18n.text('locations.phone')}
        </Typography>
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
