import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isMatch from 'lodash/isMatch';
import connect from './connector';
import VariantsContext from './context';
import { isCharacteristicEnabled, reduceSelection, findSelectionIndex } from './helpers';

/**
 * The ProductCharacteristics component.
 */
class ProductCharacteristics extends Component {
  static propTypes = {
    conditioner: PropTypes.shape().isRequired,
    render: PropTypes.func.isRequired,
    navigate: PropTypes.func,
    variantId: PropTypes.string,
    variants: PropTypes.shape(),
  }

  static defaultProps = {
    navigate() {},
    variantId: null,
    variants: null,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.refsStore = {};

    this.state = {
      characteristics: {},
    };

    props.conditioner.addConditioner('product-variants', this.checkSelection);
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (!this.props.variants && nextProps.variants) {
      this.setCharacterics(nextProps);
      this.setRefs(nextProps);
    }
  }

  /**
   * Sets the refs to the charactersistics selects.
   * @param {Object} props The props to check against.
   */
  setRefs = (props) => {
    props.variants.characteristics.forEach((char) => {
      this.refsStore[char.id] = React.createRef();
    });
  }

  /**
   * Sets the characteristics relative to the given props.
   * @param {Object} props The props to check against.
   */
  setCharacterics = (props) => {
    const { variantId, variants } = props;
    const result = variants.products.find(product => product.id === variantId);

    if (result && result.characteristics) {
      this.setState({ characteristics: result.characteristics });
    }
  }

  // TODO: offset to function
  getSelectedValue = (charId) => {
    const { characteristics } = this.state;
    return characteristics[charId] ? characteristics[charId] : null;
  }

  // TODO: offset to function
  prepareState = (id, selection, characteristics) => {
    if (!selection[id]) {
      return selection;
    }

    // Find the current index.
    const currentIndex = findSelectionIndex(characteristics, id);

    return reduceSelection(characteristics, selection, currentIndex);
  }

  /**
   * Finds the first unselected characteristic.
   * @return {Object|null}
   */
  findUnselectedCharacteristic() {
    const { characteristics } = this.state;
    const unselected = this.props.variants.characteristics.filter(char => (
      !characteristics.hasOwnProperty(char.id)
    ));

    if (unselected.length) {
      return unselected[0];
    }

    return null;
  }

  /**
   * Checks if all selections have been made.
   * @return {boolean}
   */
  checkSelection = () => {
    const { characteristics } = this.state;
    const { variants, variantId } = this.props;
    const filteredValues = Object.keys(characteristics).filter(key => !!characteristics[key]);

    const selected = !!((filteredValues.length === variants.characteristics.length) && variantId);

    if (!selected) {
      const firstUnselected = this.findUnselectedCharacteristic();

      if (firstUnselected) {
        const ref = this.refsStore[firstUnselected.id];
        ref.current.scrollIntoView({ behavior: 'smooth' });
      }
    }

    return selected;
  }

  handleFinished = () => {
    const { characteristics } = this.state;
    const { variantId, variants } = this.props;
    const filteredValues = Object.keys(characteristics).filter(key => !!characteristics[key]);

    if (filteredValues.length !== variants.characteristics.length) {
      return;
    }

    const products = variants.products.filter(product => (
      isMatch(product.characteristics, characteristics)
    ));

    if (!products.length) {
      return;
    }

    if (products[0].id === variantId) {
      return;
    }

    this.props.navigate(products[0].id);
  }

  /**
   * Stores a selected characteristic into the local state.
   * @param {Object} selection The selected item.
   */
  handleSelection = (selection) => {
    this.setState(({ characteristics }) => {
      const { variants } = this.props;
      const { id, value } = selection;
      const state = this.prepareState(id, characteristics, variants.characteristics);

      return {
        characteristics: {
          ...state,
          [id]: value,
        },
      };
    }, this.handleFinished);
  }

  /**
   *
   */
  buildValues = (selection, charId, values, charIndex) => {
    /**
     * If this is the first characteristic then
     * all values are selectable.
     */
    // TODO: check if there are no selections
    if (charIndex === 0) {
      return values.map(value => ({
        ...value,
        selectable: true,
      }));
    }

    const { variants } = this.props;

    const subset = {};
    Object.keys(selection).forEach((item, index) => {
      if (index < charIndex) {
        subset[item] = selection[item];
      }
    });

    // Filter products that match or partially match the current characteristic selection.
    const products = variants.products.filter(({ characteristics }) => (
      isMatch(characteristics, subset)
    ));

    // Check if any of the values are present inside any of the matching products.
    return values.map((value) => {
      const selectable = products.some(({ characteristics }) => (
        isMatch(characteristics, { [charId]: value.id })
      ));

      return ({
        ...value,
        selectable,
      });
    });
  }

  /**
   * @return {JSX}
   */
  render() {
    const { characteristics } = this.state;
    const { variants } = this.props;

    if (!variants) {
      return null;
    }

    return (
      <VariantsContext.Provider value={this.state}>
        {variants.characteristics.map((char, index) => {
          const disabled = !isCharacteristicEnabled(characteristics, index);
          const selected = this.getSelectedValue(char.id);
          const values = this.buildValues(characteristics, char.id, char.values, index);

          return (
            this.props.render({
              charRef: this.refsStore[char.id],
              disabled,
              id: char.id,
              key: char.id,
              label: char.label,
              select: this.handleSelection,
              selected,
              values,
            })
          );
        })}
      </VariantsContext.Provider>
    );
  }
}

export default connect(ProductCharacteristics);
