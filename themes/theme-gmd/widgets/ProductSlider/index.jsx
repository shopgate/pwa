import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Swiper, Card } from '@shopgate/engage/components';
import {
  ProductListTypeProvider,
  ProductListEntryProvider,
} from '@shopgate/engage/product/providers';
import { transformDisplayOptions } from '@shopgate/pwa-common/helpers/data';
import { withWidgetSettings } from '@shopgate/engage/core';
import appConfig, { themeColors } from '@shopgate/pwa-common/helpers/config';
import {
  ProductSlider as EngageProductSlider,
  ProductCard,
} from '@shopgate/engage/product/components';
import { makeStyles, responsiveMediaQuery, cx } from '@shopgate/engage/styles';
import Headline from 'Components/Headline';
import connect from './connector';

export const PRODUCT_SLIDER_WIDGET_LIMIT = 30;

const useStyles = makeStyles()({
  sliderContainer: {
    paddingBottom: '10px !important',
  },
  slider: {
    width: '100%',
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      padding: 0,
    },
  },
  card: {
    background: themeColors.light,
    height: '100%',
    margin: '0px 8px',
  },
});

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
  widgetSettings,
}) => {
  const { classes } = useStyles();
  const {
    sliderSettings, showName, showPrice, showReviews: showReviewsSetting,
  } = settings;
  let showReviews = showReviewsSetting;
  const { slidesPerView = 2.3 } = widgetSettings;

  if (showReviews && !appConfig.hasReviews) {
    showReviews = false;
  }

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
    /* Legacy: only re-fetch when pipeline hash changes (see UNSAFE_componentWillReceiveProps). */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional hash-only dependency
  }, [hash]);

  if (!products.length) {
    return null;
  }

  return (
    <div className={cx(classes.slider, 'theme__widgets__product-slider')}>
      {settings.headline ? (
        <Headline text={settings.headline} />
      ) : null}
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
          {products.slice(0, PRODUCT_SLIDER_WIDGET_LIMIT).map(product => (
            <Swiper.Item key={product.id}>
              <ProductListEntryProvider productId={product.id}>
                <Card className={classes.card}>
                  <ProductCard
                    product={product}
                    hideName={!showName}
                    hidePrice={!showPrice}
                    hideRating={!showReviews}
                    titleRows={2}
                  />
                </Card>
              </ProductListEntryProvider>
            </Swiper.Item>
          ))}
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
  widgetSettings: PropTypes.shape({
    slidesPerView: PropTypes.number,
  }),
};

ProductSlider.defaultProps = {
  products: [],
  widgetSettings: {},
  hash: null,
};

export default withWidgetSettings(connect(ProductSlider), EngageProductSlider.WIDGET_ID);

export { ProductSlider as UnwrappedProductSlider };
