import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Swiper, Card } from '@shopgate/engage/components';
import {
  ProductCard,
  ProductListTypeProvider,
  ProductListEntryProvider,
} from '@shopgate/engage/product';
import Headline from 'Components/Headline';
import { transformDisplayOptions } from '@shopgate/pwa-common/helpers/data';
import { withWidgetSettings } from '@shopgate/engage/core';
import { WIDGET_ID } from '@shopgate/engage/product/components/ProductSlider';
import connect from './connector';
import styles from './style';

/**
 * Creates an item for a single product.
 * @param {Object} product The product data.
 * @param {boolean} settings.showName Show the product name?
 * @param {boolean} settings.showPrice Show the product price?
 * @param {boolean} settings.showReviews Show the product reviews?
 * @return {JSX} The rendered product card.
 */
const createSliderItem = (product, { showName, showPrice, showReviews }) => {
  const key = `s${product.id}`;

  return (
    <Swiper.Item key={key} className={styles.sliderItem}>
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
  );
};

/**
 * The core product slider widget.
 */
class ProductSlider extends Component {
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
    products: PropTypes.arrayOf(PropTypes.shape()),
    widgetSettings: PropTypes.shape({
      slidesPerView: PropTypes.number,
    }),
  };

  static defaultProps = {
    products: [],
    widgetSettings: {},
  };

  /**
   * Called when the component is mounted, requests the products.
   */
  componentDidMount() {
    const { getProducts, id } = this.props;
    const { queryType, queryParams } = this.props.settings;

    getProducts(
      queryType,
      queryParams,
      {
        sort: transformDisplayOptions(this.props.settings.sortOrder),
      },
      id
    );
  }

  /**
   * @returns {string|null}
   */
  get headline() {
    const { headline = '' } = this.props.settings;
    return (headline.length) ? headline : null;
  }

  /**
   * Renders the widget.
   * @return {JSX}
   */
  render() {
    const { settings, widgetSettings } = this.props;
    const { sliderSettings } = settings;
    const { slidesPerView = 2.3 } = widgetSettings;

    // Create the slides for each product, only displays the first 30 products.
    const items = this.props.products.slice(0, 30).map((
      product => createSliderItem(product, settings)
    ));

    if (!items.length) {
      return null;
    }

    // Finally, build the slider.
    return (
      <div className={`theme__widgets__product-slider ${styles.slider}`}>
        {this.headline && <Headline text={settings.headline} />}
        <ProductListTypeProvider type="productSlider" subType="widgets">
          <Swiper
            autoPlay={sliderSettings.autostart}
            loop={false}
            indicators={false}
            controls={false}
            interval={Number.parseInt(sliderSettings.delay, 10)}
            freeMode
            slidesPerView={slidesPerView}
            classNames={{ container: styles.sliderContainer }}
          >
            {items}
          </Swiper>
        </ProductListTypeProvider>
      </div>
    );
  }
}

export default withWidgetSettings(connect(ProductSlider), WIDGET_ID);

export { ProductSlider as UnwrappedProductSlider };
