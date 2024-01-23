import React from 'react';
import { css } from 'glamor';
import { Link, Button } from '@shopgate/engage/components';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product';
import { ProductImage } from '@shopgate/engage/product';
import PropTypes from 'prop-types';
import { useBackInStockReminderContext } from '../../hooks';

const styles = {
  subscriptionContainer: css({
  }).toString(),
  subscriptionRow: css({
    flex: 1, display: 'flex',
  }).toString(),
  subscriptionLeftRow: css({
    width: '40%',
  }).toString(),
  subscriptionRightRow: css({
    width: '60%',
    padding: '8px',
  }).toString(),
  link: css({
    textDecoration: 'underline',
  }).toString(),
  removeButton: css({
    color: 'var(--color-primary)',
  }).toString(),
  removeButtonContainer: css({
    justifyContent: 'end',
    display: 'flex',
  }).toString(),
  price: css({
    textAlign: 'end',
  }).toString(),
};

/**
 * @returns {JSX}
 */
const Subscription = ({ subscription }) => {
  const { subscriptionCode, product } = subscription;
  const {
    removeBackInStoreSubscription,
    isFetching,
  } = useBackInStockReminderContext();

  return (
    <div
      className={styles.subscriptionContainer}
      key={subscriptionCode}
    >
      <div
        className={styles.subscriptionRow}
      >
        <div className={styles.subscriptionLeftRow}>
          <Link
            component="div"
            href={getProductRoute(product.id)}
            aria-hidden
          >
            <ProductImage
              alt={product?.name}
              src={product?.featuredMedia?.url}
              itemProp="image"
            />
          </Link>
        </div>
        <div
          className={styles.subscriptionRightRow}
        >
          <Link
            href={getProductRoute(product.id)}
            state={{ title: product.name }}
            className={styles.link}
          >
            {product?.name }
          </Link>
          <div>OUT OF STOCK</div>
          <div>We Will remind you </div>
          <div className={styles.price} style={{ textAlign: 'end' }}>60$</div>
          <div
            className={styles.removeButtonContainer}
          >
            <Button
              flat
              type="plain"
              className={styles.removeButton}
              disabled={isFetching}
              onClick={() => {
                removeBackInStoreSubscription({
                  subscriptionCode,
                });
              }}
            >
              Remove from list
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

Subscription.propTypes = {
  subscription: PropTypes.shape({
    product: PropTypes.shape().isRequired,
    productCode: PropTypes.string.isRequired,
    subscriptionCode: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['active', 'inactive', 'triggered']).isRequired,
  }).isRequired,
};

export default Subscription;
