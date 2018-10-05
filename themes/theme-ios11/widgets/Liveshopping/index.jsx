import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CountdownTimer from '@shopgate/pwa-common/components/CountdownTimer';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Grid from '@shopgate/pwa-common/components/Grid';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import ImageSlider from '@shopgate/pwa-ui-shared/ImageSlider';
import Card from '@shopgate/pwa-ui-shared/Card';
import DiscountBadge from '@shopgate/pwa-ui-shared/DiscountBadge';
import Price from '@shopgate/pwa-ui-shared/Price';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import ProductImage from 'Components/ProductImage';
import connect from './connector';
import styles from './style';

/**
 * Calculates the timeout from a set of live-shopping settings. The highest 'to' timestamp
 * with an active time period (that is a time span with from <= current time <= to) is
 * considered to represent the current timeout.
 * @param {Object} liveshoppings The live-shopping settings.
 * @returns {number} the unix timestamp for the timeout or null if there is no active timeout.
 */
const getLiveshoppingTimeout = (liveshoppings) => {
  const now = Date.now();

  const result = liveshoppings.reduce((best, item) => {
    // Get the time span limits.
    const from = new Date(item.from).getTime();
    const to = new Date(item.to).getTime();

    if (from <= now && to >= now) {
      // This time span is currently active.
      return Math.max(best, to);
    }

    return best;
  }, null);

  // Cut milliseconds from the result to make it a unix compatible timestamp.
  return Math.floor(result / 1000);
};

/**
 * Creates a new product slider item.
 * @param {Object} product The product.
 * @param {string} product.id The product id.
 * @param {string} product.name The product name.
 * @param {string} product.featuredImageUrl The featured image url.
 * @param {Object} product.price The product price object.
 * @param {number} timeout The timeout of the live-shopping deal.
 * @returns {JSX}
 */
const createProductSliderItem = ({
  id, name, featuredImageUrl, price,
}, timeout) => {
  const priceStriked = price.unitPriceStriked > 0 ? price.unitPriceStriked : price.msrp;

  return (
    <div key={id} className={styles.card} data-test-id="liveShoppingWidget">
      <Card className={styles.cardInnerBox}>
        <Link href={`${ITEM_PATH}/${bin2hex(id)}`}>
          <Grid>
            <Grid.Item className={styles.imagePane}>
              <ProductImage
                classNames={{
                  container: styles.updateImageContainer,
                }}
                src={featuredImageUrl}
                alt={name}
              />
            </Grid.Item>
            <Grid.Item className={styles.infoPane}>
              <div>
                {price.discount > 0 ?
                  <Fragment>
                    <Portal name={portals.PRODUCT_ITEM_DISCOUNT_BEFORE} props={{ productId: id }} />
                    <Portal name={portals.PRODUCT_ITEM_DISCOUNT} props={{ productId: id }}>
                      <DiscountBadge
                        text="liveshopping.discount_badge"
                        discount={price.discount}
                        display="big"
                        className={styles.discountBadge}
                      />
                    </Portal>
                    <Portal name={portals.PRODUCT_ITEM_DISCOUNT_AFTER} props={{ productId: id }} />
                  </Fragment>

                  : null
                }
                <Ellipsis
                  rows={2}
                  className={styles.cardTitle}
                >
                  {name}
                </Ellipsis>
                {timeout ?
                  <span className={styles.timer}>
                    <CountdownTimer timeout={timeout} />
                  </span>
                  : null
                }
              </div>
              <Grid className={styles.priceGrid}>
                {priceStriked > 0 ?
                  <Grid.Item>
                    <PriceStriked
                      className={styles.priceStriked}
                      value={priceStriked}
                      currency={price.currency}
                    />
                  </Grid.Item>
                  : null
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
};

createProductSliderItem.propTypes = {
  featuredImageUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.shape().isRequired,
};

/**
 * The live shopping (deal of the day) widget.
 */
class LiveshoppingWidget extends Component {
  /**
   * Requests the liveshopping product data when the component is mounted.
   */
  componentDidMount() {
    this.props.getLiveshoppingProducts();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const items = this.props.products.slice().map((
      product => createProductSliderItem(product, getLiveshoppingTimeout(product.liveshoppings))
    ));

    if (!items.length) {
      return null;
    }

    return (
      <div className={styles.cardsWrapper}>
        <ImageSlider indicators loop classNames={{ indicator: styles.indicator }}>
          {items}
        </ImageSlider>
      </div>
    );
  }
}

LiveshoppingWidget.propTypes = {
  getLiveshoppingProducts: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default connect(LiveshoppingWidget);
