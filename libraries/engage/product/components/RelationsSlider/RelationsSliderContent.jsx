import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Swiper, Card } from '@shopgate/engage/components';
import ProductCard from '../ProductCard';
import { useWidgetSettings } from '../../../core';
import connect from './connector';
import { WIDGET_ID } from './constants';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const RelationsSliderContent = ({ products, getRelations }) => {
  const {
    headline,
    hidePrice,
    hideRating,
    titleRows,
  } = useWidgetSettings(WIDGET_ID);

  useEffect(() => {
    getRelations();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <Fragment>
      {headline && <h3 className={styles.headline}>{headline}</h3>}
      <Swiper slidesPerView={2.25}>
        {products.map(product => (
          <Swiper.Item key={product.id}>
            <Card>
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
    </Fragment>
  );
};

RelationsSliderContent.propTypes = {
  getRelations: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape()),
};

RelationsSliderContent.defaultProps = {
  products: [],
};

export default connect(RelationsSliderContent);
