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
    fontWeight: 'normal',
    margin: 0,
    lineHeight: '2.25rem',
  },
  step: {
    lineHeight: 1,
    paddingLeft: 16,
    margin: 0,
    fontWeight: '400',
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
        <Typography variant="h1" component="h1" className={classes.headline}>
          {i18n.text(headline)}
        </Typography>
        {stepFrom !== null ? (
          <Typography variant="body1" component="h2" color="secondary" className={classes.step}>
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
