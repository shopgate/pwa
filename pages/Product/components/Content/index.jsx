import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
// Import Reviews from 'Components/Reviews';
// Import TaxDisclaimer from '@shopgate/pwa-ui-shared/TaxDisclaimer';
// Import ImageSlider from './components/ImageSlider';
import Header from '../Header';
// Import VariantSelects from './components/VariantSelects';
// Import Options from './components/Options';
// Import Description from './components/Description';
// Import Properties from './components/Properties';
import connect from './connector';
import ProductContext from '../../context';

/**
 * The product content component.
 */
class ProductContent extends Component {
  static propTypes = {
    baseProductId: PropTypes.string,
    id: PropTypes.string,
    isBaseProduct: PropTypes.bool,
    variantId: PropTypes.string,
  };

  static defaultProps = {
    baseProductId: null,
    id: null,
    isBaseProduct: null,
    variantId: null,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      productId: props.isBaseProduct === true ? props.id : null,
      variantId: props.isBaseProduct === false ? props.id : null,
    };
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    const isBaseProduct = nextProps.isBaseProduct === true;

    this.setState({
      productId: isBaseProduct ? this.props.id : nextProps.baseProductId,
      variantId: isBaseProduct ? null : this.props.id,
    });
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next state.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.id !== nextProps.id
      || this.state.productId !== nextState.productId
      || this.state.variantId !== nextState.variantId
    );
  }

  /**
   * @return {JSX}
   */
  render() {
    const { productId, variantId } = this.state;

    if (!productId && !variantId) {
      return null;
    }

    return (
      <ProductContext.Provider value={{ productId, variantId }}>
        <Fragment>
          {/* IMAGE */}
          {/* <Portal name={portals.PRODUCT_IMAGE_BEFORE} />
          <Portal name={portals.PRODUCT_IMAGE}>
            <ImageSlider />
          </Portal>
          <Portal name={portals.PRODUCT_IMAGE_AFTER} /> */}

          {/* HEADER */}
          <Portal name={portals.PRODUCT_HEADER_BEFORE} />
          <Portal name={portals.PRODUCT_HEADER}>
            <Header productId={this.props.id} />
          </Portal>
          <Portal name={portals.PRODUCT_HEADER_AFTER} />

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
        </Fragment>
      </ProductContext.Provider>
    );
  }
}

export default connect(ProductContent);
