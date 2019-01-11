import React from 'react';
import PropTypes from 'prop-types';
import CountdownTimer from '@shopgate/pwa-common/components/CountdownTimer';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import Link from '@shopgate/pwa-common/components/Link';
import Grid from '@shopgate/pwa-common/components/Grid';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Card from '@shopgate/pwa-ui-shared/Card';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import ProductImage from 'Components/ProductImage';
import Discount from '../Discount';
import connect from './connector';
import { getLiveshoppingTimeout } from './helpers';
import styles from './style';

/**
 * The LiveShoppingItem component.
 * @param {Object} props The component props.
 * @param {string} props.productId The product id.
 * @param {string} props.product The product data.
 * @returns {JSX}
 */
function LiveshoppingItem({ productId, product }) {
  const {
    featuredImageUrl,
    liveshoppings,
    name,
    price,
  } = product.productData;
  const timeout = getLiveshoppingTimeout(liveshoppings);
  const priceStriked = price.unitPriceStriked || price.msrp;

  return (
    <div className={styles.wrapper} data-test-id="liveShoppingWidget">
      <Card>
        <Link
          href={`${ITEM_PATH}/${bin2hex(productId)}`}
          state={{ title: name }}
        >
          <Grid>
            <Grid.Item className={styles.imagePane}>
              <ProductImage src={featuredImageUrl} alt={name} />
            </Grid.Item>
            <Grid.Item className={styles.infoPane}>
              <div data-test-id={name}>
                {price.discount > 0 && (
                  <Discount discount={price.discount} productId={productId} />
                )}
                <Ellipsis rows={2} className={styles.cardTitle}>
                  {name}
                </Ellipsis>
                {timeout &&
                  <span className={styles.timer}>
                    <CountdownTimer timeout={timeout / 1000} />
                  </span>
                }
              </div>
              <Grid className={styles.priceGrid}>
                {priceStriked > 0 &&
                  <Grid.Item>
                    <PriceStriked
                      className={styles.priceStriked}
                      value={priceStriked}
                      currency={price.currency}
                    />
                  </Grid.Item>
                }
                <Grid.Item>
                  <Price
                    className={priceStriked > 0 ? styles.price : ''}
                    unitPrice={price.unitPrice}
                    unitPriceMin={price.unitPriceMin}
                    currency={price.currency}
                  />
                </Grid.Item>
              </Grid>
            </Grid.Item>
          </Grid>
        </Link>
      </Card>
    </div>
  );
}

LiveshoppingItem.propTypes = {
  product: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
};

export default connect(LiveshoppingItem);
