import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isMatch from 'lodash/isMatch';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import connect from './connector';
import VariantsContext from './context';
import {
  isCharacteristicEnabled,
  getSelectedValue,
  prepareState,
  selectCharacteristics,
} from './helpers';

/**
 * The ProductCharacteristics component.
 */
class ProductCharacteristics extends Component {
  static propTypes = {
    conditioner: PropTypes.shape().isRequired,
    navigate: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
    setCharacteristics: PropTypes.func.isRequired,
    finishTimeout: PropTypes.number,
    variantId: PropTypes.string,
    variants: PropTypes.shape({
      characteristics: PropTypes.arrayOf(PropTypes.shape()),
      products: PropTypes.arrayOf(PropTypes.shape()),
    }),
  }

  static defaultProps = {
    finishTimeout: 0,
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
      highlight: null,
      characteristics: selectCharacteristics(props),
    };

    this.setRefs(props);

    props.conditioner.addConditioner('product-variants', this.checkSelection);
  }

  /** @inheritDoc */
  componentDidMount() {
    this.checkSelectedCharacteristics();
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (!this.props.variants && nextProps.variants) {
      // Initialize refs and characteristics when the variants prop was updated with a valid value.
      this.setRefs(nextProps);
      this.setState({
        characteristics: selectCharacteristics(nextProps),
      }, this.checkSelectedCharacteristics);
    }
  }

  /**
   * Sets the refs to the characteristics selects.
   * @param {Object} props The props to check against.
   */
  setRefs = (props) => {
    const { variants } = props;

    if (variants) {
      variants.characteristics.forEach((char) => {
        this.refsStore[char.id] = React.createRef();
      });
    }
  }

  /**
   * Checks if all selections have been made.
   * @return {boolean}
   */
  checkSelection = () => {
    const { characteristics } = this.state;
    const { variants, variantId } = this.props;

    if (!variants) {
      return true;
    }

    const filteredValues = Object.keys(characteristics).filter(key => !!characteristics[key]);
    const selected = !!((filteredValues.length === variants.characteristics.length) && variantId);

    if (!selected) {
      const firstUnselected = this.findUnselectedCharacteristic();

      if (firstUnselected) {
        const ref = this.refsStore[firstUnselected.id];

        // Focus the item for screen readers and broadcast a related live message.
        ref.current.focus();
        const option = ref.current.innerText;
        broadcastLiveMessage('product.pick_option_first', {
          force: true,
          params: { option },
        });

        ref.current.scrollIntoView({ behavior: 'smooth' });
        this.setState({ highlight: firstUnselected.id });
      }
    }

    return selected;
  }

  checkSelectedCharacteristics = () => {
    const { characteristics } = this.state;
    const { variantId, variants, finishTimeout } = this.props;

    if (!variants) {
      return;
    }

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

    setTimeout(() => {
      this.props.navigate(products[0].id);
    }, finishTimeout);
  }

  /**
   * Stores a selected characteristic into the local state.
   * @param {Object} selection The selected item.
   */
  handleSelection = (selection) => {
    const { variants, setCharacteristics } = this.props;
    const { id, value } = selection;

    this.setState(({ characteristics }) => {
      const state = prepareState(
        id,
        value,
        characteristics,
        variants.characteristics,
        variants.products
      );

      setCharacteristics(state);

      return {
        characteristics: {
          ...state,
        },
        highlight: null,
      };
    }, this.checkSelectedCharacteristics);
  }

  /**
   * @param {Object} selections The selections stored in the state.
   * @param {string} charId The current characteristic ID.
   * @param {Array} values The characteristic values.
   * @param {number} charIndex The characteristic index.
   * @param {string|null} selectedValue selectedValue
   * @return {Array}
   */
  buildValues = (selections, charId, values, charIndex, selectedValue) => {
    // If this is the first characteristic then all values are selectable.
    if (charIndex === 0) {
      return values.map(value => ({
        ...value,
        selectable: true,
        selected: selectedValue === value.id,
      }));
    }

    const { variants } = this.props;

    const subset = {};
    Object.keys(selections).forEach((item, index) => {
      if (index < charIndex) {
        subset[item] = selections[item];
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
        selected: selectedValue === value.id,
      });
    });
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
          const selected = getSelectedValue(char.id, characteristics);
          const values = this.buildValues(characteristics, char.id, char.values, index, selected);

          return (
            this.props.render({
              charRef: this.refsStore[char.id],
              disabled,
              highlight: this.state.highlight === char.id,
              id: char.id,
              key: char.id,
              label: char.label,
              swatch: !!char.swatch, // BETA
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
