import React from 'react';
import { css } from 'glamor';
import {
  Link,
  Ripple,
  PriceInfo,
} from '@shopgate/engage/components';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product';
import { ProductImage } from '@shopgate/engage/product';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PriceStriked from '@shopgate/pwa-ui-shared/PriceStriked';
import Price from '@shopgate/pwa-ui-shared/Price';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CrossIcon from '@shopgate/pwa-ui-shared/icons/CrossIcon';
import { useBackInStockSubscriptionsContext } from '../../hooks';
import { getThemeSettings, i18n } from '../../../core';

const { variables } = themeConfig;

const styles = {
  root: css({
    display: 'flex',
    position: 'relative',
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  }).toString(),
  imageContainer: css({
    flex: 0.4,
    marginRight: 18,
    maxWidth: 170,
    minWidth: 126,
  }).toString(),
  infoContainer: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 8,
  }).toString(),
  infoContainerRow: css({
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  }).toString(),
  quantityContainer: css({
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  }).toString(),
  priceContainer: css({
    minWidth: 100,
  }).toString(),
  priceInfo: css({
    wordBreak: 'break-word',
    fontSize: '0.875rem',
    lineHeight: '0.875rem',
    color: 'var(--color-text-low-emphasis)',
    padding: `${variables.gap.xsmall}px 0`,
  }).toString(),
  titleWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }).toString(),
  titleContainer: css({
    marginRight: 10,
    flex: 1,
  }).toString(),
  title: css({
    fontSize: 17,

    fontWeight: 600,
  }).toString(),
  removeContainer: css({
    display: 'flex',
    flexShrink: 0,
    alignItems: 'flex-start',
  }),

};

/**
 * Renders on single Back in Stock subscription
 * @param {Object} props Props.
 * @param {string} props.subscription The subscription which should be rendered
 * @returns {JSX}
 */
const Subscription = ({ subscription }) => {
  const { subscriptionCode, product } = subscription;
  const {
    removeBackInStoreSubscription,
  } = useBackInStockSubscriptionsContext();
  const { ListImage: gridResolutions } = getThemeSettings('AppImages') || {};
  const currency = product.price?.currency || 'EUR';
  const defaultPrice = product.price?.unitPrice || 0;
  const specialPrice = product.price?.unitPriceStriked;
  const hasStrikePrice = typeof specialPrice === 'number' && specialPrice !== defaultPrice;
  const price = hasStrikePrice ? specialPrice : defaultPrice;
  const productLink = getProductRoute(product.id);

  return (
    <div className={styles.root}>
      <Link
        className={styles.imageContainer}
        component="div"
        href={productLink}
        aria-hidden
      >
        <ProductImage src={product.featuredImageBaseUrl} resolutions={gridResolutions} />
      </Link>

      <div className={styles.infoContainer}>
        <div className={classNames(styles.infoContainerRow)}>
          <div className={styles.titleWrapper}>
            <Link
              href={productLink}
              tag="span"
              className={styles.titleContainer}
            >
              <span
                className={styles.title}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: `${product.name}` }}
              />
            </Link>
          </div>
          <div className={styles.removeContainer}>
            <button
              className={styles.root}
              onClick={() => removeBackInStoreSubscription({ subscriptionCode })}
              type="button"
              aria-label={i18n.text('favorites.remove')}
            >
              <Ripple className={styles.ripple}>
                <CrossIcon />
              </Ripple>
            </button>
          </div>
        </div>
        <div className={styles.infoContainerRow}>
          <div className={styles.quantityContainer}>
            <div className={styles.priceContainer}>
              {hasStrikePrice ? (
                <PriceStriked
                  value={defaultPrice}
                  currency={currency}
                />
              ) : null}
              <Price
                currency={currency}
                discounted={hasStrikePrice}
                taxDisclaimer
                unitPrice={price}
              />
              <PriceInfo
                product={product}
                currency={currency}
                className={styles.priceInfo}
                text={product?.price?.info}
              />
            </div>
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
