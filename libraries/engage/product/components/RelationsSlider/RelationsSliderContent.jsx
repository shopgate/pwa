import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Swiper, Card } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import ProductCard from '../ProductCard';
import RelationsSheet from './RelationsSheet';
import { useWidgetSettings, useCurrentProduct } from '../../../core';
import connect from './RelationsSlider.connector';
import { WIDGET_ID } from './constants';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    position: 'relative',
  },
  headline: {
    fontSize: '1rem',
    fontWeight: 500,
    padding: `0 ${variables.gap.big}px ${variables.gap.small}px`,
    margin: 0,
  },
  sliderContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
    padding: `${variables.gap.small}px 0 ${variables.gap.big}px`,
  },
  sliderItem: {
    paddingBottom: 10,
  },
  card: {
    height: '100%',
    margin: `0 ${variables.gap.small}px`,
  },
});

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const RelationsSliderContent = memo(({ products: { products, productsCount }, getRelations }) => {
  const { classes } = useStyles();
  const {
    headline,
    hidePrice,
    hideRating,
    titleRows,
    showMoreButton,
    type,
    slidesPerView = 2.3,
  } = useWidgetSettings(WIDGET_ID);
  const { productId } = useCurrentProduct();

  useEffect(() => {
    getRelations();
  }, [getRelations]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={classes.container}>
      {!!headline && <h3 className={classes.headline}>{headline}</h3>}
      {!!showMoreButton && productsCount > 10 && (
        <RelationsSheet limit={100} productId={productId} type={type} />
      )}
      <Swiper
        slidesPerView={slidesPerView}
        classNames={{ container: classes.sliderContainer }}
      >
        {products.map(product => (
          <Swiper.Item key={product.id} className={classes.sliderItem}>
            <Card className={classes.card}>
              <ProductCard
                product={product}
                hidePrice={hidePrice}
                hideName={false}
                hideRating={hideRating}
                titleRows={titleRows}
              />
            </Card>
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  );
});

RelationsSliderContent.propTypes = {
  getRelations: PropTypes.func.isRequired,
  products: PropTypes.shape({
    products: PropTypes.arrayOf(PropTypes.shape()),
    productsCount: PropTypes.number,
  }),
};

RelationsSliderContent.defaultProps = {
  products: {
    products: [],
    productsCount: 0,
  },
};

export default connect(RelationsSliderContent);
