import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '../../../core/helpers/i18n';
import { ResponsiveBackButton } from '../ResponsiveBackButton';

const useStyles = makeStyles()({
  title: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  headline: {
    margin: 0,
  },
  step: {
    paddingLeft: 16,
    margin: 0,
    paddingBottom: 2,
  },
});

/**
 * CheckoutSection component
 * @returns {JSX}
 */
const CheckoutTitle = ({
  stepFrom, stepTo, headline,
}) => {
  const { classes } = useStyles();

  return (
    <ResponsiveContainer webOnly breakpoint=">xs">
      <ResponsiveBackButton />
      <div className={classes.title}>
        <Typography variant="h1" component="h1" fontWeight="regular" className={classes.headline}>
          {i18n.text(headline)}
        </Typography>
        {stepFrom !== null ? (
          <Typography component="h2" color="secondary" className={classes.step}>
            {i18n.text('checkout.steps', {
              from: stepFrom,
              to: stepTo,
            })}
          </Typography>
        ) : null}
      </div>
    </ResponsiveContainer>
  );
};

CheckoutTitle.propTypes = {
  headline: PropTypes.string,
  stepFrom: PropTypes.number,
  stepTo: PropTypes.number,
};

CheckoutTitle.defaultProps = {
  stepFrom: null,
  stepTo: null,
  headline: 'titles.checkout',
};

export default CheckoutTitle;
