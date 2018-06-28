import { Component } from 'react';
import PropTypes from 'prop-types';
import isMatch from 'lodash/isMatch';
import connect from './connector';

/**
 * The ProductCharacteristics component.
 */
class ProductCharacteristics extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    variants: PropTypes.shape(),
  }

  static defaultProps = {
    variants: null,
  }

  state = {
    characteristics: {},
  };

  // TODO: offset to function
  getSelectedValue = (charId) => {
    const { characteristics } = this.state;
    return characteristics[charId] ? characteristics[charId] : null;
  }

  // TODO: offset to function
  isEnabled = (charIndex) => {
    if (charIndex === 0) {
      return true;
    }

    return !!Object.values(this.state.characteristics)[charIndex - 1];
  }

  /**
   * Stores a selected characteristic in local state.
   */
  handleSelection = ({ id, value }) => {
    if (this.state.characteristics[id] === value) {
      return;
    }

    this.setState({
      characteristics: {
        ...this.state.characteristics,
        [id]: value,
      },
    });
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
    const { [charId]: a, ...rest } = selection;

    // Filter products that match or partially match the current characteristic selection.
    const products = variants.products.filter(({ characteristics }) => (
      isMatch(characteristics, rest)
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
      const disabled = !this.isEnabled(index);
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
