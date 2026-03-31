import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  MapPriceHint,
  OrderQuantityHint,
  EffectivityDates,
  Swatches,
  getProductRoute,
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/engage/product';
import { Link, Availability } from '@shopgate/engage/components';
import { StockInfoLists } from '@shopgate/engage/locations/components';
import { hasNewServices as checkHasNewServices, i18n } from '@shopgate/engage/core/helpers';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import ItemName from '../ItemName';
import ItemPrice from '../ItemPrice';
import ShortDescription from '../ShortDescription';

const useStyles = makeStyles()(theme => ({
  details: {
    lineHeight: 1.35,
    '&:not(:empty)': {
      padding: '12px 16px',
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '& > *:empty': {
          display: 'none',
        },
        '& > *:first-of-type[style*="display:none"] + *:not([style*="display:none"])': {
          paddingTop: 8,
        },
      },
    },
  },
  itemNameLink: {
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      '& > *:not(:first-of-type)': {
        paddingTop: 8,
      },
    },
  },
  propertiesLink: {
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      '& > *:not([style*="display:none"])': {
        paddingTop: 8,
      },
    },
  },
  itemPrice: {
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      paddingTop: theme.spacing(1),
      marginTop: 'auto',
      fontSize: '1.125rem',
      '& ul > li': {
        flexGrow: 'inherit',
        lineHeight: '1.5rem',
        '&:first-of-type': {
          marginRight: theme.spacing(2),
        },
      },
    },
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      fontSize: '1.25rem',
    },
  },
  quantityHint: {
    paddingTop: 4,
  },
}));

/**
 * The item details component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product.
 * @param {Object} props.display The display object.
 * @param {Object} [props.productListTypeMeta] Optional meta object with data from the product list
 * type context.
 * @returns {JSX.Element}
 */
const ItemDetails = ({ product, display, productListTypeMeta }) => {
  const { classes, cx } = useStyles();
  const {
    id: productId, name = null, stock = null, shortDescription = null,
  } = product;

  const hasNewServices = useMemo(() => checkHasNewServices(), []);

  if (display && !display.name && !display.price && !display.reviews) {
    return null;
  }

  return (
    <Link
      className={cx(classes.details, 'theme__product-grid__item__item-details')}
      tabIndex={0}
      href={getProductRoute(productId)}
      state={{
        title: product.name,
        ...productListTypeMeta,
      }}
    >
      <div>
        <Swatches productId={productId} />
      </div>
      <div className={classes.itemNameLink}>
        <ItemName display={display} productId={productId} name={name} />
      </div>

      <div className={classes.propertiesLink}>
        <ShortDescription shortDescription={shortDescription} />

        <MapPriceHint productId={productId} />

        <OrderQuantityHint productId={productId} className={classes.quantityHint} />

        <EffectivityDates productId={productId} />

        { hasNewServices && (
        <>
          <Availability
            state={!stock || stock.orderable
              ? AVAILABILITY_STATE_OK
              : AVAILABILITY_STATE_ALERT}
            text={i18n.text('product.available.not')}
            showWhenAvailable={false}
          />
          <StockInfoLists product={product} />
        </>
        )}

        <div className={classes.itemPrice}>
          <ItemPrice product={product} display={display} />
        </div>
      </div>
    </Link>
  );
};

ItemDetails.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
  productListTypeMeta: PropTypes.shape(),
};

ItemDetails.defaultProps = {
  display: null,
  productListTypeMeta: null,
};

export default ItemDetails;
