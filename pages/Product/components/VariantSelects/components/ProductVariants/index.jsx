import React, { Component } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import StepByStep from './helpers/StepByStep';

export default WrappedComponent => class extends Component {
  /**
   * These props are currently only used within componentWillReceiveProps and
   * shouldComponentUpdate. The linter complains about this.
   * @type {Object}
   */
  static propTypes = {
    getVariantsByProductId: PropTypes.func.isRequired,
    currentBaseProductId: PropTypes.string,
    currentProductVariantId: PropTypes.string,
    getProductData: PropTypes.func,
    selection: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      selected: PropTypes.bool.isRequired,
      disabled: PropTypes.bool.isRequired,
      values: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        disabled: PropTypes.bool.isRequired,
        availability: PropTypes.shape({
          state: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
        }),
      })).isRequired,
    })),
    setProductVariantId: PropTypes.func,
    variants: PropTypes.shape({
      products: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        hasOptions: PropTypes.bool.isRequired,
        characteristics: PropTypes.objectOf(PropTypes.string).isRequired,
      })).isRequired,
      characteristics: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })).isRequired,
      })).isRequired,
    }),
  };

  static defaultProps = {
    selection: null,
    variants: null,
    getProductData: () => {},
    setProductVariantId: () => {},
    currentBaseProductId: null,
    currentProductVariantId: null,
  };

  static contextTypes = {
    history: PropTypes.shape(),
  };

  /**
   * The component constructor
   * @param {Object} props The component props
   */
  constructor(props) {
    super(props);

    this.state = {
      selection: null,
    };

    this.key = null;
    this.selectHelper = null;
    this.productId = null;
  }

  /**
   * Fetch variants if available.
   */
  componentDidMount() {
    this.key = this.context.history.getActive().key;

    if (this.props.variants) {
      this.updateFromProps(this.props);
    }
  }

  /**
   * Initializes the selection helper as soon as product variants are available
   * @param {Object} nextProps Incoming props
   */
  componentWillReceiveProps(nextProps) {
    this.updateFromProps(nextProps);
  }

  /**
   * Makes sure to only update if really necessary
   * @param {Object} nextProps Incoming props
   * @param {Object} nextState Incoming state
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.selectHelper && Array.isArray(nextState.selection) && nextState.selection.length;
  }

  /**
   * Updates the component state from props.
   * @param {Object} [props] The props from which to update
   */
  updateFromProps(props = this.props) {
    // Don't update when the variant select is in the background
    if (this.key && (this.key !== this.context.history.getActive().key)) {
      return;
    }

    const { variants, currentBaseProductId, currentProductVariantId } = props;

    if (!this.selectHelper && variants) {
      /**
       * Initialize the helper. This only happens once per instance,
       * to avoid a reset of the component and it's children.
       * @type {StepByStep}
       */
      this.selectHelper = new StepByStep(variants).init();

      // Check if there is already a variantId set. If yes set in in the selection as selected.
      if (currentProductVariantId) {
        this.handleVariantPreselection(variants, currentProductVariantId);
      } else {
        // Trigger the component state update
        this.updateSelectionState();
      }
    } else {
      /**
       * Re-init for DOM cached pages.
       * We need this to sync the redux state with the component state again.
       */
      const productIdChangedFromNull = (
        this.props.currentBaseProductId === null && currentBaseProductId !== null
      );

      // If the productId was null, we know that we have to set the variantId in redux again.
      if (this.selectHelper && productIdChangedFromNull) {
        const variantId = this.productId;

        if (variantId) {
          const {
            variants: baseProductVariants = {},
          } = this.props.getVariantsByProductId(currentBaseProductId) || {};

          // Check if the variantId we want to set belongs to the currentProduct
          if (find(baseProductVariants.products, { id: variantId })) {
            // Trigger a setProductVariantId to bring the redux store back to the correct state.
            this.props.setProductVariantId(variantId);
          }
        }
      } else if (currentProductVariantId && variants) {
        this.handleVariantPreselection(variants, currentProductVariantId);
      }
    }
  }

  /**
   * Creates new props for the wrapped component.
   * @return {Object} The props
   */
  createProps() {
    const { selection } = this.state;
    const props = { ...this.props };
    delete props.variants;

    return {
      ...props,
      selection,
      handleSelectionUpdate: (characteristicId, characteristicValueId) => {
        this.handleSelectionUpdate(characteristicId, characteristicValueId);
      },
    };
  }

  /**
   * Preselect the the variant with the given currentProductVariantId
   * @param {Object} variants Variants Object
   * @param {string} currentProductVariantId current product variant id form store
   */
  handleVariantPreselection(variants, currentProductVariantId) {
    const { characteristics = {} } = find(variants.products, { id: currentProductVariantId }) || {};

    Object.keys(characteristics).forEach((characteristicId) => {
      const characteristicValueId = characteristics[characteristicId];
      this.handleSelectionUpdate(characteristicId, characteristicValueId);
    });
  }

  /**
   * Sets a characteristic value within a characteristic selection
   * @param {string} characteristicId A characteristic id
   * @param {string} characteristicValueId A characteristic value id
   * @return {ProductVariants}
   */
  handleSelectionUpdate(characteristicId, characteristicValueId) {
    if (this.selectHelper) {
      const updated = this.selectHelper.setCharacteristicValue(
        characteristicId,
        characteristicValueId
      );

      if (updated) {
        this.updateSelectionState();
      }
    }

    return this;
  }

  /**
   * Updates selection state
   * @return {ProductVariants}
   */
  updateSelectionState() {
    this.setState({
      selection: this.selectHelper.getSelection(),
    });

    const productId = this.selectHelper.getProductId();

    if (productId !== this.productId) {
      this.productId = productId;

      // Fetch data for the selected variant.
      this.props.getProductData(productId);
    }

    return this;
  }

  /**
   * Renders the underlying component
   * @returns {JSX}
   */
  render() {
    return (
      <WrappedComponent {...this.createProps()} />
    );
  }
};
