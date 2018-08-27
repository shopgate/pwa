import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Conditioner } from '@shopgate/pwa-core';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
import Reviews from 'Components/Reviews';
import TaxDisclaimer from '@shopgate/pwa-ui-shared/TaxDisclaimer';
import ImageSlider from '../ImageSlider';
import Header from '../Header';
import Characteristics from '../Characteristics';
import Options from '../Options';
import Description from '../Description';
import Properties from '../Properties';
import connect from './connector';
import { ProductContext } from '../../context';

/**
 * The product content component.
 */
class ProductContent extends Component {
  static propTypes = {
    baseProductId: PropTypes.string,
    isVariant: PropTypes.bool,
    productId: PropTypes.string,
    variantId: PropTypes.string,
  };

  static defaultProps = {
    baseProductId: null,
    isVariant: false,
    productId: null,
    variantId: null,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.baseContextValue = {
      conditioner: new Conditioner(),
    };

    this.state = {
      options: {},
      productId: props.variantId ? props.baseProductId : props.productId,
      variantId: props.variantId ? props.variantId : null,
    };
  }

  /**
   * Maps the single productId from the route and the different properties from the connector
   * selectors to a productId and a variantId and updates the component state with them.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    let productId = (nextProps.baseProductId ? nextProps.baseProductId : nextProps.productId);

    let { variantId } = nextProps;

    const productIdChanged = this.props.productId !== nextProps.productId;

    if (productIdChanged && nextProps.isVariant) {
      if (this.props.baseProductId) {
        // Use the previous baseProductId as productId when the component switched to a variant.
        productId = this.props.baseProductId;
      }

      // Map the productId from the route to the variantId.
      variantId = nextProps.productId;
    }

    this.setState({
      productId,
      variantId,
    });
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next state.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.productId !== nextState.productId ||
      this.state.variantId !== nextState.variantId ||
      !isEqual(this.state.options, nextState.options)
    );
  }

  /**
   * Stores the selected options in local state.
   * @param {string} optionId The ID of the option.
   * @param {string} value The option value.
   */
  storeOptionSelection = (optionId, value) => {
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        [optionId]: value,
      },
    }));
  }

  /**
   * @return {JSX}
   */
  render() {
    if (!this.state.productId && !this.state.variantId) {
      return null;
    }

    const id = this.state.variantId || this.state.productId;

    const contextValue = {
      ...this.state,
      ...this.baseContextValue,
    };

    return (
      <ProductContext.Provider value={contextValue}>
        {/* IMAGE */}
        <Portal name={portals.PRODUCT_IMAGE_BEFORE} />
        <Portal name={portals.PRODUCT_IMAGE}>
          <ImageSlider productId={this.state.productId} variantId={this.state.variantId} />
        </Portal>
        <Portal name={portals.PRODUCT_IMAGE_AFTER} />

        {/* HEADER */}
        <Portal name={portals.PRODUCT_HEADER_BEFORE} />
        <Portal name={portals.PRODUCT_HEADER} >
          <Header />
        </Portal>
        <Portal name={portals.PRODUCT_HEADER_AFTER} />

        {/* CHARACTERISTICS */}
        <Portal name={portals.PRODUCT_VARIANT_SELECT_BEFORE} />
        <Portal name={portals.PRODUCT_VARIANT_SELECT}>
          <Characteristics
            productId={this.state.productId}
            variantId={this.state.variantId}
          />
        </Portal>
        <Portal name={portals.PRODUCT_VARIANT_SELECT_AFTER} />

        {/* OPTIONS */}
        <Portal name={portals.PRODUCT_OPTIONS_BEFORE} />
        <Portal name={portals.PRODUCT_OPTIONS}>
          <Options
            productId={id}
            storeSelection={this.storeOptionSelection}
            currentOptions={this.state.options}
          />
        </Portal>
        <Portal name={portals.PRODUCT_OPTIONS_AFTER} />

        {/* DESCRIPTION */}
        <Portal name={portals.PRODUCT_DESCRIPTION_BEFORE} />
        <Portal name={portals.PRODUCT_DESCRIPTION}>
          <Description productId={this.state.productId} variantId={this.state.variantId} />
        </Portal>
        <Portal name={portals.PRODUCT_DESCRIPTION_AFTER} />

        {/* PROPERTIES */}
        <Portal name={portals.PRODUCT_PROPERTIES_BEFORE} />
        <Portal name={portals.PRODUCT_PROPERTIES}>
          <Properties productId={this.state.productId} variantId={this.state.variantId} />
        </Portal>
        <Portal name={portals.PRODUCT_PROPERTIES_AFTER} />

        {/* REVIEWS */}
        <Portal name={portals.PRODUCT_REVIEWS_BEFORE} />
        <Portal name={portals.PRODUCT_REVIEWS}>
          <Reviews productId={this.state.productId} />
        </Portal>
        <Portal name={portals.PRODUCT_REVIEWS_AFTER} />

        {/* TAX DISCLAIMER */}
        <Portal name={portals.PRODUCT_TAX_DISCLAIMER_BEFORE} />
        <Portal name={portals.PRODUCT_TAX_DISCLAIMER}>
          <TaxDisclaimer />
        </Portal>
        <Portal name={portals.PRODUCT_TAX_DISCLAIMER_AFTER} />
      </ProductContext.Provider>
    );
  }
}

export default connect(ProductContent);
