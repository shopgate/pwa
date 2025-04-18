import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  SheetDrawer,
  SheetList,
  Menu,
  ResponsiveContainer,
} from '@shopgate/engage/components';
import { ThemeContext } from '@shopgate/engage/core/contexts';
import { VariantContext, ProductContext } from '@shopgate/engage/product/contexts';
import { VariantAvailability } from '@shopgate/engage/product/components';
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
    contextRef: PropTypes.shape(),
    fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
    onClose: PropTypes.func,
    onDidClose: PropTypes.func,
    onSelect: PropTypes.func,
    productId: PropTypes.string,
    selectedValue: PropTypes.string,
    selection: PropTypes.shape(),
  };

  static defaultProps = {
    fulfillmentMethods: null,
    onClose() { },
    onSelect() { },
    onDidClose() { },
    productId: null,
    selectedValue: null,
    contextRef: null,
    selection: null,
    isFetching: false,
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
   * @param {string} itemId The id that was selected
   */
  handleItemClick = (event, itemId) => {
    event.stopPropagation();
    this.props.onSelect(itemId);
  }

  /**
   * Renders the availability text inside the sheet item.
   * @param {string} value The value that the sheet item represents.
   * @return {React.Component|null}
   */
  renderAvailability = (value) => {
    const { fulfillmentMethods, isFetching } = this.props;
    if (fulfillmentMethods || isFetching) {
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
      items, label, open, selectedValue, contextRef, onDidClose,
    } = this.props;

    let selectedIndex;

    if (selectedValue) {
      selectedIndex = items.findIndex(item => item.id === selectedValue);
    } else {
      selectedIndex = items.findIndex(item => item.selectable);
    }

    return (
      <Fragment>
        <ResponsiveContainer appAlways breakpoint="xs">
          <SheetDrawer
            title={label}
            isOpen={open}
            onClose={this.onClose}
            onDidOpen={this.onDidOpen}
            onDidClose={onDidClose}
          >
            <SheetList className="theme__product__characteristic__sheet">
              {items.map((item, index) => (
                <Item
                  item={item}
                  key={item.id}
                  onClick={this.handleItemClick}
                  rightComponent={() => this.renderAvailability(item.id)}
                  selected={item.id === selectedValue}
                  ref={index === selectedIndex ? this.firstSelectableItemRef : null}
                  characteristics={{
                    ...this.props.selection,
                    [this.props.charId]: item.id,
                  }}
                />
              ))}
            </SheetList>
          </SheetDrawer>
        </ResponsiveContainer>
        <ResponsiveContainer webOnly breakpoint=">xs">
          <ThemeContext.Consumer>
            {({ ...contextProps }) => (
              <Menu
                isOpen={open}
                onClose={this.onClose}
                contextRef={contextRef}
              >
                {/* Since the Menu component uses a "portal" internally, we need to manually
                  transfer the ThemeContext inside, so that children can access it */}
                <ThemeContext.Provider value={contextProps}>
                  {items.map((item, index) => (
                    <Item
                      key={item.id}
                      item={item}
                      onClick={this.handleItemClick}
                      rightComponent={() => this.renderAvailability(item.id)}
                      selected={item.id === selectedValue}
                      ref={index === selectedIndex ? this.firstSelectableItemRef : null}
                      characteristics={{
                        ...this.props.selection,
                        [this.props.charId]: item.id,
                      }}
                    />
                  ))}
                </ThemeContext.Provider>
              </Menu>
            )}
          </ThemeContext.Consumer>
        </ResponsiveContainer>
      </Fragment>
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
        {({ productId, fulfillmentMethods, isFetching }) => (
          <VariantContext.Consumer>
            {({ characteristics }) => (
              <CharacteristicSheet
                productId={productId}
                selection={characteristics}
                setViewAriaHidden={setAriaHidden}
                fulfillmentMethods={fulfillmentMethods}
                isFetching={isFetching}
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
