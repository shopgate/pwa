import React from 'react';
import { css } from 'glamor';
import {
  Link,
  Ripple,
  PriceInfo,
  CrossIcon,
  PriceStriked,
  Price,
  Availability,
} from '@shopgate/engage/components';
import { getProductRoute, ProductImage } from '@shopgate/engage/product';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/engage';
import { BackInStockButton } from '@shopgate/engage/back-in-stock/components';
import {
  getThemeSettings, i18n,
} from '@shopgate/engage/core';
import { useBackInStockSubscriptions } from '@shopgate/engage/back-in-stock/hooks';

const { variables } = themeConfig;

const styles = {
  root: css({
    display: 'flex',
    position: 'relative',
    marginBottom: 16,
  }).toString(),
  imageContainer: css({
    flex: 0.4,
    maxWidth: 170,
    minWidth: 70,
  }).toString(),
  infoContainer: css({
    flex: 1,
  }).toString(),
  infoContainerRow: css({
    display: 'flex',
    justifyContent: 'space-between',
  }).toString(),
  baseContainerRow: css({
    flexDirection: 'column',
    display: 'flex',
    marginTop: '8px',
  }).toString(),
  priceContainerRow: css({
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'end',
    marginTop: '8px',
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
    textAlign: 'right',
  }).toString(),
  titleContainer: css({
  }).toString(),
  title: css({
    fontSize: 17,
    fontWeight: 600,
    flexWrap: 'wrap',
    overflowWrap: 'anywhere',
  }).toString(),
  removeContainer: css({
    minWidth: '30px',
  }).toString(),
  availabilityText: css({
    fontSize: '0.875rem',
  }).toString(),
};

/**
 * Renders on single Back in Stock subscription
 * @param {Object} props Props.
 * @param {string} props.subscription The subscription which should be rendered
 * @returns {JSX}
 */
const Subscription = ({
  subscription,
}) => {
  const { subscriptionCode, product } = subscription;
  const {
    removeBackInStockSubscription,
  } = useBackInStockSubscriptions();
  const { ListImage: gridResolutions } = getThemeSettings('AppImages') || {};
  const currency = product.price?.currency || 'EUR';
  const defaultPrice = product.price?.unitPrice || 0;
  const specialPrice = product.price?.unitPriceStriked;
  const hasStrikePrice = product.price?.discount > 0;
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
        <div className={styles.infoContainerRow}>
          <div>
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
              onClick={() => removeBackInStockSubscription({ subscriptionCode })}
              type="button"
              aria-label={i18n.text('favorites.remove')}
            >
              <Ripple className={styles.ripple}>
                <CrossIcon />
              </Ripple>
            </button>
          </div>
        </div>
        <div className={classNames(styles.baseContainerRow)}>
          <Availability
            text={product?.availability?.text}
            state={product?.availability?.state}
            showWhenAvailable={false}
            className={styles.availabilityText}
          />
          <BackInStockButton
            subscription={subscription}
            onClick={() => {}}
          />
        </div>
        <div className={styles.priceContainerRow}>
          {hasStrikePrice ? (
            <PriceStriked
              value={specialPrice}
              currency={currency}
            />
          ) : null}
          <Price
            currency={currency}
            discounted={hasStrikePrice}
            unitPrice={defaultPrice}
          />
          {!!product.price.info && (
            <PriceInfo text={product.price.info} className={styles.priceInfo} />
          )}
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
