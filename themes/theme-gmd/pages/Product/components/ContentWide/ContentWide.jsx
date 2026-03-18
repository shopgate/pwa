import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { ResponsiveContainer, SurroundPortals } from '@shopgate/engage/components';
import { FulfillmentSelector } from '@shopgate/engage/locations';
import { PORTAL_PRODUCT_IMAGE_SLIDER } from '@shopgate/engage/components/constants';
import { Section } from '@shopgate/engage/a11y';
import {
  ProductProperties,
  Description,
  ProductUnitQuantityPicker,
  OrderQuantityHint,
  ProductDiscountBadge,
} from '@shopgate/engage/product';
import { Reviews } from '@shopgate/engage/reviews';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import FavoriteButtonWide from '@shopgate/engage/favorites/components/FavoriteButtonWide';
import { Characteristics, Options } from '@shopgate/engage/product/components';
import { DESKTOP_MENU_BAR_HEIGHT } from '../../../../constants';
import Header from '../Header';
import Price from './Price';
import Media from './Media';
import AddToCartButton from './AddToCartButton';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  root: {
    padding: '32px 16px 32px 32px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  mediaRow: {
    flex: 1,
  },
  contentRow: {
    display: 'flex',
    flexDirection: 'column',
    flex: 2.2,
    [responsiveMediaQuery('>md')]: {
      paddingRight: 16,
    },
  },
  extraRow: {
    flex: 0.9,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `1px solid ${colors.shade7}`,
    minHeight: `calc(100vh - ${DESKTOP_MENU_BAR_HEIGHT}px)`,
    paddingTop: 16,
    margin: '-32px 0 -32px 0',
  },
  extraPrice: {
    padding: 16,
  },
  priceContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    padding: 16,
  },
  priceColumn: {
    flex: 1,
  },
  orderQuantityHintColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  quantityPicker: {
    display: 'flex',
    flexDirection: 'column',
  },
  orderQuantityHint: {
    paddingTop: 8,
  },
});

/**
 * Wide variation of PDP content.
 * @param {Object} props The component pros.
 * @returns {JSX}
 */
const ContentWide = ({
  productId,
  variantId,
  conditioner,
}) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.mediaRow}>
        <ProductDiscountBadge productId={productId} />
        <SurroundPortals
          portalName={PORTAL_PRODUCT_IMAGE_SLIDER}
          portalProps={{
            productId,
            variantId,
          }}
        >
          <Media productId={productId} variantId={variantId} />
        </SurroundPortals>
      </div>
      <div className={classes.contentRow}>
        <Header />
        <Section title="product.sections.fulfillment">
          <FulfillmentSelector
            productId={variantId || productId}
            conditioner={conditioner}
          />
        </Section>
        <Section title="product.sections.options">
          <Characteristics productId={productId} variantId={variantId} />
          <Options />
        </Section>
        <ResponsiveContainer breakpoint="<=md">
          <div className={classes.priceContainer}>
            <div className={classes.priceColumn}>
              <Price />
            </div>
            <div className={classes.priceColumn}>
              <Section title="product.sections.quantity">
                <ProductUnitQuantityPicker className={classes.quantityPicker}>
                  <OrderQuantityHint
                    productId={variantId || productId}
                    className={classes.orderQuantityHint}
                  />
                </ProductUnitQuantityPicker>
              </Section>
            </div>
          </div>
          <AddToCartButton />
          <FavoriteButtonWide productId={variantId || productId} />
        </ResponsiveContainer>
        <Section title="product.sections.description">
          <Description
            productId={productId}
            variantId={variantId}
          />
        </Section>
        <Section title="product.sections.properties">
          <ProductProperties
            productId={productId}
            variantId={variantId}
          />
        </Section>
        <Section title="product.sections.ratings">
          <Reviews productId={productId} />
        </Section>
      </div>
      <ResponsiveContainer breakpoint=">md">
        <div className={classes.extraRow}>
          <div className={classes.extraPrice}>
            <Price />
          </div>
          <Section title="product.sections.quantity">
            <ProductUnitQuantityPicker className={classes.quantityPicker}>
              <OrderQuantityHint
                productId={variantId || productId}
                className={classes.orderQuantityHint}
              />
            </ProductUnitQuantityPicker>
          </Section>
          <AddToCartButton />
          <FavoriteButtonWide productId={variantId || productId} />
        </div>
      </ResponsiveContainer>
    </div>
  );
};

ContentWide.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  variantId: PropTypes.string,
};

ContentWide.defaultProps = {
  variantId: null,
};

export default ContentWide;
