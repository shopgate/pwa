import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { UIEvents, withCurrentProduct } from '../../../core';
import { SheetDrawer } from '../../../components';
import { sheet } from './style';
import Product from './Product';
import Locations from './Locations';
import connect from './connector';
import StoreSelectorContext from './context';

const EVENT_SET_OPEN = 'event.setOpen';
const EVENT_SET_CLOSED = 'event.setClosed';

/**
 * Renders the store selector sheet.
 */
class StoreSelector extends PureComponent {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape()),
    product: PropTypes.shape(),
    selectedVariants: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    selectLocation: PropTypes.func,
  }

  static defaultProps = {
    locations: null,
    product: null,
    selectedVariants: [],
    selectLocation: () => { },
  }

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    UIEvents.addListener(EVENT_SET_OPEN, this.handleSetOpen);
    UIEvents.addListener(EVENT_SET_CLOSED, this.handleSetOpen);
    this.callback = () => { };
  }

  state = {
    isOpen: false,
  };

  /**
   * Deregisters the event listeners.
   */
  componentWillUnmount() {
    UIEvents.removeListener(EVENT_SET_OPEN, this.handleSetOpen);
    UIEvents.removeListener(EVENT_SET_CLOSED, this.handleSetOpen);
  }

  /**
   * Opens the store selector sheet.
   * @param {Function} [callback=null] A callback that will be called once the sheet closes.
   */
  handleSetOpen = (callback = null) => {
    if (callback !== null) {
      this.callback = callback;
    }

    this.setState({ isOpen: true });
  }

  /**
   * Closes the store selector sheet.
   * @param {Object} [location=null] The selected location.
   */
  handleSetClosed = (location = null) => {
    this.setState({ isOpen: false });
    this.callback(location);
    this.callback = () => { };
  }

  /**
   * Handles the selection of a store location from the sheet.
   * @param {Object} params The parameters to store.
   * @param {string} params.locationCode The location code.
   * @param {string} params.locationName The location name.
   * @param {string} params.addresscode The address code.
   * @param {number} params.visibleInventory The visible stock amount.
   */
  handleSelectLocation = ({
    code, name, addressCode, visibleInventory,
  }) => {
    const { selectLocation, product } = this.props;
    const location = {
      code,
      name,
      addressCode,
      visibleInventory,
      productCode: product.id,
    };

    selectLocation(location);
    this.handleSetClosed(location);
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { product, locations, selectedVariants } = this.props;
    const { isOpen } = this.state;
    const { __ } = this.context.i18n();
    const title = __('product.location.headline');

    const contextValue = {
      selectLocation: this.handleSelectLocation,
      product,
      locations,
      selectedVariants,
    };

    return (
      <StoreSelectorContext.Provider value={contextValue}>
        <SheetDrawer isOpen={isOpen} title={title} onClose={this.handleSetClosed}>
          <div className={sheet}>
            <Product />
            <Locations />
          </div>
        </SheetDrawer>
      </StoreSelectorContext.Provider>
    );
  }
}

const StoreSelectorWrapped = withCurrentProduct(connect(StoreSelector));

/**
 * Opens the store selector sheet.
 * @param {Function} [callback=null] A callback that will be called once the sheet closes.
 */
StoreSelectorWrapped.open = (callback = null) => {
  UIEvents.emit(EVENT_SET_OPEN, callback);
};

/**
 * Closes the store selector sheet.
 */
StoreSelectorWrapped.close = () => {
  UIEvents.emit(EVENT_SET_CLOSED);
};

export default StoreSelectorWrapped;
