import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Swiper, Card } from '@shopgate/engage/components';
import {
  ProductListTypeProvider,
  ProductListEntryProvider,
} from '@shopgate/engage/product/providers';
import { transformDisplayOptions } from '@shopgate/pwa-common/helpers/data';
import { withWidgetSettings } from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  ProductSlider as EngageProductSlider,
  ProductCard,
} from '@shopgate/engage/product/components';
import Headline from 'Components/Headline';
import connect from './connector';
import styles from './style';

export const PRODUCT_SLIDER_WIDGET_LIMIT = 30;

/**
 * The core product slider widget.
 */
class ProductSlider extends PureComponent {
  static propTypes = {
    getProducts: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    // The settings as received by the pipeline request
    settings: PropTypes.shape({
      headline: PropTypes.string.isRequired, // The headline of the product slider.
      layout: PropTypes.string.isRequired, // The layout of the product slider.
      queryParams: PropTypes.oneOfType([ // The query parameters for this slider.
        PropTypes.string,
        PropTypes.array,
      ]),
      queryType: PropTypes.number.isRequired, // The query type ID.
      showName: PropTypes.bool.isRequired, // Should the product name be displayed?
      showPrice: PropTypes.bool.isRequired, // Should the product price be displayed?
      showReviews: PropTypes.bool.isRequired, // Should the user ratings be displayed?
      sortOrder: PropTypes.string.isRequired, // The sort order.
      sliderSettings: PropTypes.shape({
        autostart: PropTypes.bool.isRequired, // Should the slider start automatically?
        delay: PropTypes.oneOfType([ // The delay between the automatic slides loops
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

  static defaultProps = {
    products: [],
    widgetSettings: {},
    hash: null,
  };

  /* eslint-disable extra-rules/potential-point-free */
  /**
   * Called when the component is mounted, requests the products.
   */
  componentDidMount() {
    this.requestProducts();
  }
  /* eslint-enable extra-rules/potential-point-free */

  /**
   * When we receive new products then we can adjust the state.
   * @param {Object} nextProps The next set of component props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.hash !== this.props.hash) {
      this.requestProducts();
    }
  }

  /**
   * Requests products for the widget
   */
  requestProducts() {
    const { getProducts, id } = this.props;
    const { queryType, queryParams } = this.props.settings;

    getProducts(
      queryType,
      queryParams,
      {
        sort: transformDisplayOptions(this.props.settings.sortOrder),
        limit: PRODUCT_SLIDER_WIDGET_LIMIT,
      },
      id
    );
  }

  /**
   * Renders a headline if we have one.
   * @returns {JSX.Element}
   */
  renderHeadline = () => {
    if (this.props.settings.headline) {
      return (
        <Headline text={this.props.settings.headline} />
      );
    }

    return null;
  };

  /**
   * Renders the widget.
   * @return {JSX.Element}
   */
  render() {
    const { settings, products, widgetSettings } = this.props;
    const {
      sliderSettings, showName, showPrice,
    } = settings;
    let { showReviews } = settings;
    const { slidesPerView = 2.3 } = widgetSettings;

    if (showReviews && !appConfig.hasReviews) {
      showReviews = false;
    }

    if (!products.length) {
      return null;
    }

    // check for reduced motion in user phone settings
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return (
      <div className={`${styles.slider} theme__widgets__product-slider`}>
        {this.renderHeadline()}
        <ProductListTypeProvider type="productSlider" subType="widgets">
          <Swiper
            {...(sliderSettings.autostart && !reduceMotion
              ? {
                autoplay: {
                  delay: Number.parseInt(sliderSettings.delay, 10),
                },
              }
              : { autoplay: false })
            }
            aria-live="off"
            a11y={{ enabled: false }}
            loop={false}
            indicators={false}
            controls={false}
            freeMode
            slidesPerView={slidesPerView}
            classNames={{ container: styles.sliderContainer }}
          >
            {products.slice(0, PRODUCT_SLIDER_WIDGET_LIMIT).map(product => (
              <Swiper.Item
                key={product.id}
                aria-live="off"
                tabIndex={0}
                aria-label={product.name}
              >
                <ProductListEntryProvider productId={product.id}>
                  <Card className={styles.card}>
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
  }
}

export default withWidgetSettings(connect(ProductSlider), EngageProductSlider.WIDGET_ID);

export { ProductSlider as UnwrappedProductSlider };
