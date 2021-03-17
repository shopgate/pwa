import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { FulfillmentSelector } from '@shopgate/engage/locations';
import { Section } from '@shopgate/engage/a11y';
import {
  ProductProperties,
  Description,
  ProductUnitQuantityPicker,
  OrderQuantityHint,
} from '@shopgate/engage/product';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import FavoriteButtonWide from '@shopgate/engage/favorites/components/FavoriteButtonWide';
import Reviews from 'Components/Reviews';
import { DESKTOP_MENU_BAR_HEIGHT } from '../../../../constants';
import Characteristics from '../Characteristics';
import Options from '../Options';
import Header from '../Header';
import Price from './Price';
import Media from './Media';
import AddToCartButton from './AddToCartButton';

const { colors } = themeConfig;

const styles = {
  root: css({
    padding: '32px 16px 32px 32px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  }).toString(),
  mediaRow: css({
    flex: 1,
  }).toString(),
  contentRow: css({
    display: 'flex',
    flexDirection: 'column',
    flex: 2.2,
    [responsiveMediaQuery('>md')]: {
      paddingRight: 16,
    },
  }).toString(),
  extraRow: css({
    flex: 0.9,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `1px solid ${colors.shade7}`,
    minHeight: `calc(100vh - ${DESKTOP_MENU_BAR_HEIGHT}px)`,
    paddingTop: 16,
    margin: '-32px 0 -32px 0',
  }).toString(),
  extraPrice: css({
    padding: 16,
  }).toString(),
  priceContainer: css({
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    padding: 16,
  }).toString(),
  priceColumn: css({
    flex: 1,
  }).toString(),
  orderQuantityHintColumn: css({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  }).toString(),
  quantityPicker: css({
    display: 'flex',
    flexDirection: 'column',
  }).toString(),
  orderQuantityHint: css({
    paddingTop: 8,
  }).toString(),
};

/**
 * Wide variation of PDP content.
 * @param {Object} props The component pros.
 * @returns {JSX}
 */
const ContentWide = ({
  productId,
  variantId,
  conditioner,
}) => (
  <div className={styles.root}>
    <div className={styles.mediaRow}>
      <Media productId={productId} variantId={variantId} />
    </div>
    <div className={styles.contentRow}>
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
        <div className={styles.priceContainer}>
          <div className={styles.priceColumn}>
            <Price />
          </div>
          <div className={styles.priceColumn}>
            <Section title="product.sections.quantity">
              <ProductUnitQuantityPicker className={styles.quantityPicker}>
                <OrderQuantityHint
                  productId={variantId || productId}
                  className={styles.orderQuantityHint}
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
      <div className={styles.extraRow}>
        <div className={styles.extraPrice}>
          <Price />
        </div>
        <Section title="product.sections.quantity">
          <ProductUnitQuantityPicker className={styles.quantityPicker}>
            <OrderQuantityHint
              productId={variantId || productId}
              className={styles.orderQuantityHint}
            />
          </ProductUnitQuantityPicker>
        </Section>
        <AddToCartButton />
        <FavoriteButtonWide productId={variantId || productId} />
      </div>
    </ResponsiveContainer>
  </div>
);

ContentWide.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  variantId: PropTypes.string,
};

ContentWide.defaultProps = {
  variantId: null,
};

export default ContentWide;
