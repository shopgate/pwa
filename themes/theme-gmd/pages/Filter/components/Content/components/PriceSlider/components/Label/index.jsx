import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { I18n } from '@shopgate/engage/components';
import styles from '../../style';

const { currency } = appConfig;

/**
 * The filter price range slider label component.
 */
class Label extends PureComponent {
  static propTypes = {
    priceLength: PropTypes.string.isRequired,
    priceMax: PropTypes.number.isRequired,
    priceMin: PropTypes.number.isRequired,
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { priceLength, priceMax, priceMin } = this.props;

    return (
      <I18n.Text string="price.range">
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
    );
  }
}

export default Label;
