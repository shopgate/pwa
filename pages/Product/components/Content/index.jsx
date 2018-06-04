import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
import ImageSlider from '../ImageSlider';
// Import Reviews from 'Components/Reviews';
// Import TaxDisclaimer from '@shopgate/pwa-ui-shared/TaxDisclaimer';
// Import Header from './components/Header';
// Import VariantSelects from './components/VariantSelects';
// Import Options from './components/Options';
// Import Description from './components/Description';
// Import Properties from './components/Properties';
import connect from './connector';

/**
 * The product content component.
 */
class ProductContent extends Component {
  static propTypes = {
    name: PropTypes.string,
    productId: PropTypes.string,
  };

  static defaultProps = {
    name: null,
    productId: null,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      variantId: null,
    };
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next state.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props.productId && nextProps.productId) return true;
    if (!this.props.name && nextProps.name) return true;
    if (this.state.variantId !== nextState.variantId) return true;
    return false;
  }

  /**
   * Sets the variant ID.
   * @param {string} variantId The selected variant ID.
   */
  handleSetVariantId = (variantId) => {
    if (variantId !== this.state.variantId) {
      this.setState({ variantId });
    }
  }

  /**
   * @return {JSX}
   */
  render() {
    return (
      <div data-test-id={`product: ${this.props.name}`}>
        {/* IMAGE */}
        <Portal name={portals.PRODUCT_IMAGE_BEFORE} />
        <Portal name={portals.PRODUCT_IMAGE}>
          <ImageSlider productId={this.props.productId} />
        </Portal>
        <Portal name={portals.PRODUCT_IMAGE_AFTER} />

        {/* HEADER */}
        {/* <Portal name={portals.PRODUCT_HEADER_BEFORE} />
        <Portal name={portals.PRODUCT_HEADER}>
          <Header />
        </Portal>
        <Portal name={portals.PRODUCT_HEADER_AFTER} /> */}

        {/* VARIANT SELECT */}
        {/* <Portal name={portals.PRODUCT_VARIANT_SELECT_BEFORE} />
        <Portal name={portals.PRODUCT_VARIANT_SELECT}>
          <VariantSelects />
        </Portal>
        <Portal name={portals.PRODUCT_VARIANT_SELECT_AFTER} /> */}

        {/* OPTIONS */}
        {/* <Portal name={portals.PRODUCT_OPTIONS_BEFORE} />
        <Portal name={portals.PRODUCT_OPTIONS}>
          <Options />
        </Portal>
        <Portal name={portals.PRODUCT_OPTIONS_AFTER} /> */}

        {/* DESCRIPTION */}
        {/* <Portal name={portals.PRODUCT_DESCRIPTION_BEFORE} />
        <Portal name={portals.PRODUCT_DESCRIPTION}>
          <Description />
        </Portal>
        <Portal name={portals.PRODUCT_DESCRIPTION_AFTER} /> */}

        {/* PROPERTIES */}
        {/* <Portal name={portals.PRODUCT_PROPERTIES_BEFORE} />
        <Portal name={portals.PRODUCT_PROPERTIES}>
          <Properties />
        </Portal>
        <Portal name={portals.PRODUCT_PROPERTIES_AFTER} /> */}

        {/* REVIEWS */}
        {/* <Portal name={portals.PRODUCT_REVIEWS_BEFORE} />
        <Portal name={portals.PRODUCT_REVIEWS}>
          <Reviews />
        </Portal>
        <Portal name={portals.PRODUCT_REVIEWS_AFTER} /> */}

        {/* TAX DISCLAIMER */}
        {/* <Portal name={portals.PRODUCT_TAX_DISCLAIMER_BEFORE} />
        <Portal name={portals.PRODUCT_TAX_DISCLAIMER}>
          <TaxDisclaimer />
        </Portal>
        <Portal name={portals.PRODUCT_TAX_DISCLAIMER_AFTER} /> */}
      </div>
    );
  }
}

export default connect(ProductContent);
