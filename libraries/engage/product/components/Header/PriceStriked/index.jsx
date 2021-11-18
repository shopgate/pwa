import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_PRICE_STRIKED,
  PRODUCT_PRICE_STRIKED_AFTER,
  PRODUCT_PRICE_STRIKED_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { withPriceCalculation } from '@shopgate/engage/product';
import I18n from '@shopgate/pwa-common/components/I18n';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import StrikePrice from '@shopgate/pwa-ui-shared/PriceStriked';
import { useWidgetSettings } from '@shopgate/engage/core/hooks/useWidgetSettings';
import connect from './connector';
import styles from './style';

/**
 * The PriceStriked component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceStriked = ({ price }) => {
  const { msrpLabel = 'price.msrp', unitPriceStrikedLabel } = useWidgetSettings('@shopgate/engage/product/components/Header/PriceStriked');

  return (
    <Fragment>
      <Portal name={PRODUCT_PRICE_STRIKED_BEFORE} />
      <Portal name={PRODUCT_PRICE_STRIKED}>
        <PlaceholderLabel className={styles.placeholder} ready={(price !== null)}>
          {(price && price.msrp > 0 && price.unitPrice !== price.msrp) && (
            <Fragment>
              {!!msrpLabel && (<I18n.Text string={msrpLabel} className={styles.msrp} />)}
              <StrikePrice
                className={styles.msrpStriked}
                value={price.msrp}
                currency={price.currency}
              />
            </Fragment>
          )}
          {(price && !price.msrp && price.unitPriceStriked > 0) && (
            <Fragment>
              {!!unitPriceStrikedLabel && (
                <I18n.Text string={unitPriceStrikedLabel} className={styles.msrp} />
              )}
              <StrikePrice value={price.unitPriceStriked} currency={price.currency} className={unitPriceStrikedLabel ? styles.msrpStriked : ''} />
            </Fragment>
          )}
        </PlaceholderLabel>
      </Portal>
      <Portal name={PRODUCT_PRICE_STRIKED_AFTER} />
    </Fragment>
  );
};

PriceStriked.propTypes = {
  price: PropTypes.shape(),
};

PriceStriked.defaultProps = {
  price: null,
};

export default connect(withPriceCalculation(PriceStriked));
