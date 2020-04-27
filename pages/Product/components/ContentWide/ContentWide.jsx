import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { FulfillmentSelector } from '@shopgate/engage/locations';
import { Section } from '@shopgate/engage/a11y';
import {
  ProductProperties,
  Description,
  ProductUnitQuantityPicker,
} from '@shopgate/engage/product';
import Characteristics from '../Characteristics';
import Options from '../Options';
import Header from '../Header';

const styles = {
  root: css({
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
    flex: 2.5,
  }).toString(),
  extraRow: css({
    flex: 0.5,
  }).toString(),
  priceContainer: css({
    display: 'flex',
    flexDirection: 'row',
  }).toString(),
  priceColumn: css({
    flex: 1,
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
    <div className={styles.mediaRow} />
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
      <div className={styles.priceContainer}>
        <div className={styles.priceColumn}>
          <Section title="product.sections.quantity">
            <ProductUnitQuantityPicker />
          </Section>
        </div>
      </div>
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
    </div>
    {/*
    <div className={styles.extraRow}>
    </div>
    */}
  </div>
);

export default ContentWide;
