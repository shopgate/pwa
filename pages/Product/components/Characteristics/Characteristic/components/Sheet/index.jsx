import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SheetDrawer, SheetList } from '@shopgate/engage/components';
import { VariantContext, VariantAvailability, ProductContext } from '@shopgate/engage/product';
import { ViewContext } from '@shopgate/engage/components/View';
import Item from '../SheetItem';

/**
 * The CharacteristicSheet component.
 */
class CharacteristicSheet extends PureComponent {
  static propTypes = {
    charId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    label: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    setViewAriaHidden: PropTypes.func.isRequired,
    fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    productId: PropTypes.string,
    selectedValue: PropTypes.string,
    selection: PropTypes.shape(),
  };

  static defaultProps = {
    fulfillmentMethods: null,
    onClose() { },
    onSelect() { },
    productId: null,
    selectedValue: null,
    selection: null,
  };

  firstSelectableItemRef = React.createRef();

  /**
   * Focuses the first selectable item and hides the view for screen readers.
   */
  onDidOpen = () => {
    if (this.firstSelectableItemRef.current) {
      this.firstSelectableItemRef.current.focus();
    }

    this.props.setViewAriaHidden(true);
  };

  /**
   * Shows the view for screen readers.
   * @param {Object} e The event payload.
   */
  onClose = (e) => {
    this.props.onClose(e);
    this.props.setViewAriaHidden(false);
  }

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
    const { fulfillmentMethods } = this.props;
    if (fulfillmentMethods) {
      return null;
    }

    const selection = {
      ...this.props.selection,
      [this.props.charId]: value,
    };

    return <VariantAvailability characteristics={selection} productId={this.props.productId} />;
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      items, label, open, selectedValue,
    } = this.props;

    let selectedIndex;

    if (selectedValue) {
      selectedIndex = items.findIndex(item => item.id === selectedValue);
    } else {
      selectedIndex = items.findIndex(item => item.selectable);
    }

    return (
      <SheetDrawer title={label} isOpen={open} onClose={this.onClose} onDidOpen={this.onDidOpen}>
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
  <ViewContext.Consumer>
    {({ setAriaHidden }) => (
      <ProductContext.Consumer>
        {({ productId, fulfillmentMethods }) => (
          <VariantContext.Consumer>
            {({ characteristics }) => (
              <CharacteristicSheet
                productId={productId}
                selection={characteristics}
                setViewAriaHidden={setAriaHidden}
                fulfillmentMethods={fulfillmentMethods}
                {...props}
              />
            )}
          </VariantContext.Consumer>
        )}
      </ProductContext.Consumer>
    )}
  </ViewContext.Consumer>

);

export default SheetComponent;
