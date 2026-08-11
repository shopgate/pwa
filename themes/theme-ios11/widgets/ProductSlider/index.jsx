import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Swiper, Card } from '@shopgate/engage/components';
import {
  ProductListTypeProvider,
  ProductListEntryProvider,
} from '@shopgate/engage/product/providers';
import { transformDisplayOptions } from '@shopgate/pwa-common/helpers/data';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { ProductCard } from '@shopgate/engage/product/components';
import { useSlidesPerView } from '@shopgate/engage/product/hooks';
import { makeStyles, cx } from '@shopgate/engage/styles';
import Headline from 'Components/Headline';
import connect from './connector';

export const PRODUCT_SLIDER_WIDGET_LIMIT = 30;

const useStyles = makeStyles()(theme => ({
  sliderContainer: {
    paddingBottom: '10px !important',
  },
  slider: {
    width: '100%',
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
  card: {
    background: theme.palette.background.surface,
    height: '100%',
    margin: '0px 8px',
    borderRadius: 11,
  },
}));

/**
 * The core product slider widget.
 * @param {Object} props Component props.
 * @returns {JSX.Element|null}
 */
const ProductSlider = ({
  getProducts,
  hash,
  id,
  products,
  settings,
}) => {
  const { classes } = useStyles();
  const { sliderSettings } = settings;
  const slidesPerView = useSlidesPerView();

  useEffect(() => {
    const { queryType, queryParams, sortOrder } = settings;

    getProducts(
      queryType,
      queryParams,
      {
        sort: transformDisplayOptions(sortOrder),
        limit: PRODUCT_SLIDER_WIDGET_LIMIT,
      },
      id
    );
    /* Legacy: only re-fetch when pipeline hash changes. */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional hash-only dependency
  }, [hash]);

  const items = products.slice(0, PRODUCT_SLIDER_WIDGET_LIMIT).map((product) => {
    let showReviewsSanitized = settings.showReviews;

    if (showReviewsSanitized && !appConfig.hasReviews) {
      showReviewsSanitized = false;
    }

    const key = `s${product.id}`;

    return (
      <Swiper.Item key={key}>
        <ProductListEntryProvider productId={product.id}>
          <Card className={classes.card}>
            <ProductCard
              product={product}
              hideName={!settings.showName}
              hidePrice={!settings.showPrice}
              hideRating={!showReviewsSanitized}
              titleRows={2}
            />
          </Card>
        </ProductListEntryProvider>
      </Swiper.Item>
    );
  });

  if (!items.length) {
    return null;
  }

  const { headline = '' } = settings;
  const showHeadline = headline.length > 0;

  return (
    <div className={cx('theme__widgets__product-slider', classes.slider)}>
      {showHeadline ? <Headline text={settings.headline} /> : null}
      <ProductListTypeProvider type="productSlider" subType="widgets">
        <Swiper
          {...sliderSettings.autostart && {
            autoplay: {
              delay: Number.parseInt(sliderSettings.delay, 10),
            },
          }}
          loop={false}
          indicators={false}
          controls={false}
          freeMode
          slidesPerView={slidesPerView}
          classNames={{ container: classes.sliderContainer }}
        >
          {items}
        </Swiper>
      </ProductListTypeProvider>
    </div>
  );
};

ProductSlider.propTypes = {
  getProducts: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    headline: PropTypes.string.isRequired,
    layout: PropTypes.string.isRequired,
    queryParams: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    queryType: PropTypes.number.isRequired,
    showName: PropTypes.bool.isRequired,
    showPrice: PropTypes.bool.isRequired,
    showReviews: PropTypes.bool.isRequired,
    sortOrder: PropTypes.string.isRequired,
    sliderSettings: PropTypes.shape({
      autostart: PropTypes.bool.isRequired,
      delay: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
    }).isRequired,
  }).isRequired,
  hash: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.shape()),
};

ProductSlider.defaultProps = {
  products: [],
  hash: null,
};

export default connect(ProductSlider);

export { ProductSlider as UnwrappedProductSlider };
