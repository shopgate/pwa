import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Conditioner } from '@shopgate/pwa-core';
import TaxDisclaimer from '@shopgate/pwa-ui-shared/TaxDisclaimer';
import { Section } from '@shopgate/engage/a11y';
import { isBeta } from '@shopgate/engage/core';
import { ProductProperties, RelationsSlider, StoreSelector } from '@shopgate/engage/product';
import Reviews from 'Components/Reviews';
import Media from '../Media';
import Header from '../Header';
import Characteristics from '../Characteristics';
import Options from '../Options';
import Description from '../Description';
import AppBar from '../AppBar';
import AddToCartBar from '../AddToCartBar';
import connect from './connector';
import { ProductContext } from '../../context';

/**
 * The product content component.
 */
class ProductContent extends PureComponent {
  static propTypes = {
    baseProductId: PropTypes.string,
    currency: PropTypes.string,
    isVariant: PropTypes.bool,
    productId: PropTypes.string,
    variantId: PropTypes.string,
  };

  static defaultProps = {
    baseProductId: null,
    currency: null,
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
      currency: props.currency,
      options: {},
      optionsPrices: {},
      productId: props.variantId ? props.baseProductId : props.productId,
      variantId: props.variantId ? props.variantId : null,
      characteristics: null,
      quantity: 1,
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
    const productIdChanged = (this.props.productId !== nextProps.productId);

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
      currency: nextProps.currency,
      quantity: 1,
    });
  }

  /**
   * Stores the selected options in local state.
   * @param {string} optionId The ID of the option.
   * @param {string} value The option value.
   * @param {number} [price=0] The option value.
   */
  setOption = (optionId, value, price = 0) => {
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        [optionId]: value,
      },
      optionsPrices: {
        ...prevState.optionsPrices,
        [optionId]: !!value && price,
      },
    }));
  };

  /**
   * Stores the selected quantity. Call provided cb
   * @param {number} quantity product quantity.
   * @param {Function} cb when context is updated
   */
  setQuantity = (quantity, cb = null) => {
    this.setState({ quantity }, cb);
  };

  /**
   * Stores the currently selected characteristics.
   * @param {Object} characteristics The characteristics set.
   */
  setCharacteristics = (characteristics) => {
    this.setState(() => ({
      characteristics: (characteristics !== null) ? {
        ...characteristics,
      } : null,
    }));
  }

  /**
   * @return {JSX}
   */
  render() {
    const id = this.state.variantId || this.state.productId;
    const contextValue = {
      ...this.state,
      ...this.baseContextValue,
      setOption: this.setOption,
      quantity: this.state.quantity,
      setQuantity: this.setQuantity,
      setCharacteristics: this.setCharacteristics,
    };

    return (
      <Fragment>
        <AppBar productId={this.state.productId} />
        <ProductContext.Provider value={contextValue}>
          <Media aria-hidden />
          <Section title="product.sections.information">
            <Header />
          </Section>
          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <RelationsSlider desiredPosition="header" />
          <Section title="product.sections.options">
            <Characteristics productId={this.state.productId} variantId={this.state.variantId} />
            <Options />
          </Section>
          <Section title="product.sections.description">
            <Description productId={this.state.productId} variantId={this.state.variantId} />
          </Section>
          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          <RelationsSlider desiredPosition="description" />
          <Section title="product.sections.properties">
            <ProductProperties
              productId={this.state.productId}
              variantId={this.state.variantId}
            />
          </Section>
          <Section title="product.sections.ratings">
            <Reviews productId={this.state.productId} />
          </Section>
          <TaxDisclaimer />
          <AddToCartBar
            productId={id}
            options={contextValue.options}
            conditioner={contextValue.conditioner}
          />
          {/*
            This feature is currently in BETA testing.
            It should only be used for approved BETA Client Projects
          */}
          {isBeta() && <StoreSelector />}
        </ProductContext.Provider>
      </Fragment>
    );
  }
}

export default connect(ProductContent);
