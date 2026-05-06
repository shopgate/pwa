import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Swiper, Card } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import ProductCard from '../ProductCard';
import RelationsSheet from './RelationsSheet';
import { useWidgetSettings, useCurrentProduct } from '../../../core';
import connect from './RelationsSlider.connector';
import { WIDGET_ID } from './constants';

const useStyles = makeStyles()(theme => ({
  container: {
    position: 'relative',
  },
  headline: {
    fontSize: '1rem',
    fontWeight: 500,
    padding: theme.spacing(0, 2, 1),
    margin: 0,
  },
  sliderContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
    padding: theme.spacing(1, 0, 2),
  },
  sliderItem: {
    paddingBottom: 10,
  },
  card: {
    height: '100%',
    margin: theme.spacing(0, 1),
  },
}));

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
