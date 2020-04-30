import React, { Fragment } from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '../../../core/helpers/i18n';

const { colors } = themeConfig;

const styles = {
  title: css({
    marginTop: 16,
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  }),
  headline: css({
    fontSize: '2rem',
    margin: 0,
    color: colors.dark,
    lineHeight: 1,
  }),
  step: css({
    fontSize: '1rem',
    lineHeight: 1,
    color: 'var(--color-secondary)',
    paddingLeft: 16,
    margin: 0,
    fontWeight: '400',
  }),
};

/**
 * CheckoutSection component
 * @returns {JSX}
 */
const CheckoutTitle = ({
  stepFrom, stepTo,
}) => (
  <Fragment>
    <ResponsiveContainer webOnly breakpoint=">xs">
      <div className={styles.title}>
        <h1 className={styles.headline}>
          {i18n.text('titles.checkout')}
        </h1>
        {stepFrom !== null ? (
          <h2 className={styles.step}>
            {i18n.text('checkout.steps', { from: stepFrom, to: stepTo })}
          </h2>
        ) : null}
      </div>
    </ResponsiveContainer>
  </Fragment>
);

CheckoutTitle.propTypes = {
  stepFrom: PropTypes.number,
  stepTo: PropTypes.number,
};

CheckoutTitle.defaultProps = {
  stepFrom: null,
  stepTo: null,
};

export default CheckoutTitle;
