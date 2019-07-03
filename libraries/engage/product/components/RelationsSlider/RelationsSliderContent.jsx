import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Swiper, Card } from '@shopgate/engage/components';
import ProductCard from '../ProductCard';
import RelationsSheet from './RelationsSheet';
import { useWidgetSettings, useCurrentProduct } from '../../../core';
import connect from './connector';
import { WIDGET_ID } from './constants';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const RelationsSliderContent = memo(connect(({ products, getRelations }) => {
  const {
    headline,
    hidePrice,
    hideRating,
    titleRows,
    showMoreButton,
    type,
  } = useWidgetSettings(WIDGET_ID);
  const { productId } = useCurrentProduct();

  useEffect(() => {
    getRelations();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {!!headline && <h3 className={styles.headline}>{headline}</h3>}
      {!!showMoreButton && <RelationsSheet limit={100} productId={productId} type={type} />}
      <Swiper
        slidesPerView={2.25}
        classNames={{ container: styles.sliderContainer }}
      >
        {products.map(product => (
          <Swiper.Item key={product.id}>
            <Card className={styles.card}>
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
}));

RelationsSliderContent.propTypes = {
  getRelations: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape()),
};

RelationsSliderContent.defaultProps = {
  products: [],
};

export default RelationsSliderContent;
