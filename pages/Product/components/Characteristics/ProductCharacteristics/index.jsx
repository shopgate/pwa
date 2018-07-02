import { Component } from 'react';
import PropTypes from 'prop-types';
import isMatch from 'lodash/isMatch';
import connect from './connector';
import { isCharacteristicEnabled, reduceSelection, findSelectionIndex } from './helpers';

/**
 * The ProductCharacteristics component.
 */
class ProductCharacteristics extends Component {
  static propTypes = {
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

  state = {
    characteristics: {},
  };

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (!this.props.variants && nextProps.variants) {
      this.setCharacterics(nextProps);
    }
  }

  /**
   * Sets the characteristics relative to the given props.
   * @param {Object} props The props to check against.
   */
  setCharacterics = (props) => {
    const { variantId, variants } = props;
    const { characteristics } = variants.products.find(product => product.id === variantId);

    if (characteristics) {
      this.setState({ characteristics });
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

    return variants.characteristics.map((char, index) => {
      const disabled = !isCharacteristicEnabled(characteristics, index);
      const selected = this.getSelectedValue(char.id);
      const values = this.buildValues(characteristics, char.id, char.values, index);

      return (
        this.props.render({
          disabled,
          id: char.id,
          key: char.id,
          label: char.label,
          selected,
          values,
          select: this.handleSelection,
        })
      );
    });
  }
}

export default connect(ProductCharacteristics);
