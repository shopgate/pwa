import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SheetDrawer, SheetList } from '@shopgate/engage/components';
import VariantContext from '@shopgate/pwa-common/components/ProductCharacteristics/context';
import Item from '../SheetItem';
import VariantAvailability from '../VariantAvailability';
import { ProductContext } from './../../../../../context';

/**
 * The CharacteristicSheet component.
 */
class CharacteristicSheet extends PureComponent {
  static propTypes = {
    charId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    label: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    productId: PropTypes.string,
    selectedValue: PropTypes.string,
    selection: PropTypes.shape(),
  };

  static defaultProps = {
    onClose() {},
    onSelect() {},
    productId: null,
    selectedValue: null,
    selection: null,
  };

  /**
   * Focuses the first selectable item for screen readers.
   */
  onDidOpen = () => {
    if (this.firstSelectableItemRef.current) {
      this.firstSelectableItemRef.current.focus();
    }
  };

  firstSelectableItemRef = React.createRef();

  /**
   * @param {Object} event The event object.
   */
  handleItemClick = (event) => {
    event.stopPropagation();
    this.props.onSelect(event.target.value);
  }

  /**
   * Renders the availability text inside the sheet item.
   * @param {string} value The value that the sheet item represents.
   * @return {React.Component|null}
   */
  renderAvailability = (value) => {
    const { charId, productId, items } = this.props;
    const lastValue = items.slice(-1)[0];

    // Check if this is the last characteristic to be set.
    if (lastValue.id !== charId) {
      return null;
    }

    const selection = {
      ...this.props.selection,
      [this.props.charId]: value,
    };

    return <VariantAvailability characteristics={selection} productId={productId} />;
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      items, label, onClose, open, selectedValue,
    } = this.props;

    let selectedIndex;

    if (selectedValue) {
      selectedIndex = items.findIndex(item => item.id === selectedValue);
    } else {
      selectedIndex = items.findIndex(item => item.selectable);
    }

    return (
      <SheetDrawer title={label} isOpen={open} onClose={onClose} onDidOpen={this.onDidOpen} >
        <SheetList>
          {items.map((item, index) => (
            <Item
              item={item}
              key={item.id}
              onClick={this.handleItemClick}
              rightComponent={() => this.renderAvailability(item.id)}
              selected={item.id === selectedValue}
              ref={index === selectedIndex ? this.firstSelectableItemRef : null}
            />
          ))}
        </SheetList>
      </SheetDrawer>
    );
  }
}

/**
 * @param {Object} props The original component props.
 * @returns {JSX}
 */
const SheetComponent = props => (
  <ProductContext.Consumer>
    {({ productId }) => (
      <VariantContext.Consumer>
        {({ characteristics }) => (
          <CharacteristicSheet
            productId={productId}
            selection={characteristics}
            {...props}
          />
        )}
      </VariantContext.Consumer>
    )}
  </ProductContext.Consumer>
);

export default SheetComponent;
