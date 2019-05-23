import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Swiper } from '@shopgate/engage/components';
import Card from '@shopgate/pwa-ui-shared/Card';
import Headline from 'Components/Headline';
import ProductCard from 'Components/ProductCard';
import { transformDisplayOptions } from '@shopgate/pwa-common/helpers/data';
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
      <Card className={styles.card}>
        <ProductCard
          product={product}
          hideName={!showName}
          hidePrice={!showPrice}
          hideRating={!showReviews}
          titleRows={2}
        />
      </Card>
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
  };

  static defaultProps = {
    products: [],
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
    const { settings } = this.props;
    const { sliderSettings } = settings;

    // Create the slides for each product, only displays the first 30 products.
    const items = this.props.products.slice(0, 30).map((
      product => createSliderItem(product, settings)
    ));

    if (!items.length) {
      return null;
    }

    // Finally, build the slider.
    return (
      <div className={styles.slider}>
        {this.headline && <Headline text={settings.headline} />}
        <Swiper
          autoPlay={sliderSettings.autostart}
          loop={false}
          indicators={false}
          controls={false}
          interval={Number.parseInt(sliderSettings.delay, 10)}
          snapItems={false}
          slidesPerView={2.3}
          classNames={{ container: styles.sliderContainer }}
        >
          {items}
        </Swiper>
      </div>
    );
  }
}

export default connect(ProductSlider);
