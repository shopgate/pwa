import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import styles from '../../style';

const { currency } = appConfig;

/**
 * The filter price range slider label component.
 * @returns {JSX}
 */
const Label = ({ priceLength, priceMax, priceMin }) => (
  <Fragment>
    <span className={styles.srOnly}>
      {i18n.text('price.range', {
        fromPrice: i18n.price(priceMin, currency, false),
        toPrice: i18n.price(priceMax, currency, false),
      })}
    </span>
    <I18n.Text string="price.range" aria-hidden>
      <I18n.Placeholder forKey="fromPrice">
        <span className={styles.price} style={{ minWidth: priceLength }}>
          <I18n.Price price={priceMin} currency={currency} fractions={false} />
        </span>
      </I18n.Placeholder>
      <I18n.Placeholder forKey="toPrice">
        <span className={styles.price} style={{ minWidth: priceLength }}>
          <I18n.Price price={priceMax} currency={currency} fractions={false} />
        </span>
      </I18n.Placeholder>
    </I18n.Text>
  </Fragment>
);

Label.propTypes = {
  priceLength: PropTypes.string.isRequired,
  priceMax: PropTypes.number.isRequired,
  priceMin: PropTypes.number.isRequired,
};

export default memo(Label);
