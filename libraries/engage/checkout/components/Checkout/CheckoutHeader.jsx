import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from '@shopgate/engage/components';
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
    fontSize: '2.125rem',
    fontWeight: 'normal',
    margin: 0,
    lineHeight: '2.25rem',
  },
  step: {
    fontSize: '1rem',
    lineHeight: 1,
    color: 'var(--color-secondary)',
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
        <h1 className={classes.headline}>
          {i18n.text(headline)}
        </h1>
        {stepFrom !== null ? (
          <h2 className={classes.step}>
            {i18n.text('checkout.steps', { from: stepFrom, to: stepTo })}
          </h2>
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
