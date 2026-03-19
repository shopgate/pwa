import React from 'react';
import {
  Link,
  Ripple,
  PriceInfo,
  CrossIcon,
  PriceStriked,
  Price,
  Availability,
} from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
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

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    position: 'relative',
    marginBottom: 16,
  },
  imageContainer: {
    flex: 0.4,
    maxWidth: 170,
    minWidth: 70,
    paddingRight: '8px',
  },
  infoContainer: {
    flex: 1,
  },
  infoContainerRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  baseContainerRow: {
    flexDirection: 'column',
    display: 'flex',
    marginTop: '8px',
  },
  priceContainerRow: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'end',
    marginTop: '8px',
  },
  priceInfo: {
    wordBreak: 'break-word',
    fontSize: '0.875rem',
    lineHeight: '0.875rem',
    color: 'var(--color-text-low-emphasis)',
    padding: `${variables.gap.xsmall}px 0`,
    textAlign: 'right',
  },
  titleContainer: {
  },
  title: {
    fontSize: 17,
    fontWeight: 600,
    flexWrap: 'wrap',
    overflowWrap: 'anywhere',
  },
  removeContainer: {
    minWidth: '30px',
  },
  availabilityText: {
    fontSize: '0.875rem',
    marginBottom: '4px',
  },
  characteristicText: {
    fontSize: '0.875rem',
  },
  ripple: {
    minWidth: '17px',
  },
});

/**
 * Renders on single Back in Stock subscription
 * @param {Object} props Props.
 * @param {string} props.subscription The subscription which should be rendered
 * @returns {JSX}
 */
const Subscription = ({
  subscription,
}) => {
  const { classes } = useStyles();
  const { subscriptionCode, product, productCode } = subscription;
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
    <div className={classes.root}>
      <Link
        className={classes.imageContainer}
        component="div"
        href={productLink}
        aria-hidden
      >
        <ProductImage src={product.featuredImageBaseUrl} resolutions={gridResolutions} />
      </Link>

      <div className={classes.infoContainer}>
        <div className={classes.infoContainerRow}>
          <Link
            href={productLink}
            tag="span"
            className={classes.titleContainer}
          >
            <span
              className={classes.title}
                // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: `${product.name}` }}
            />
          </Link>
          <div className={classes.removeContainer}>
            <button
              onClick={() => removeBackInStockSubscription({ subscriptionCode })}
              type="button"
              aria-label={i18n.text('favorites.remove')}
            >
              <Ripple className={classes.ripple}>
                <CrossIcon />
              </Ripple>
            </button>
          </div>
        </div>
        <div className={classNames(classes.baseContainerRow)}>
          {product?.characteristics?.map(({ label, value }) =>
            <div
              key={label + value}
              className={classes.characteristicText}
            >
              {label}
              {': '}
              {value}
            </div>)}
          <Availability
            text={product?.availability?.text}
            state={product?.availability?.state}
            showWhenAvailable={false}
            className={classes.availabilityText}
          />
          {subscription?.status === 'active' && (
            <BackInStockButton
              subscription={subscription}
              productId={productCode}
            />
          )}
        </div>
        <div className={classes.priceContainerRow}>
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
            <PriceInfo text={product.price.info} className={classes.priceInfo} />
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
