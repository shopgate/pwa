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
  /**
   * Opens the store selector sheet.
   */
  static open = () => {
    UIEvents.trigger(EVENT_SET_OPEN);
  }

  /**
   * Closes the store selector sheet.
   */
  static close = () => {
    UIEvents.trigger(EVENT_SET_CLOSED);
  }

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

  handleSetOpen = () => {
    this.setState({ isOpen: true });
  }

  handleSetClosed = () => {
    this.setState({ isOpen: false });
  }

  /**
   * Handles the selection of a store location from the sheet.
   * @param {Object} params The parameters to store.
   * @param {string} params.locationCode The location code.
   * @param {string} params.addresscode The address code.
   * @param {number} params.visibleStock The visible stock amount.
   */
  handleSelectLocation = ({ locationCode, addressCode, visibleStock }) => {
    const { selectLocation, product } = this.props;
    const location = {
      productCode: product.id,
      locationCode,
      addressCode,
      visibleStock,
    };

    selectLocation(location);
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { product, locations, selectedVariants } = this.props;
    const { isOpen } = this.state;
    const { __ } = this.context.i18n();

    const contextValue = {
      selectLocation: this.handleSelectLocation,
      close: this.handleSetClosed,
      product,
      locations,
      selectedVariants,
    };

    return (
      <StoreSelectorContext.Provider value={contextValue}>
        <SheetDrawer
          isOpen={isOpen}
          title={__('product.location.headline')}
          onClose={this.handleSetClosed}
        >
          <div className={sheet}>
            <Product />
            <Locations />
          </div>
        </SheetDrawer>
      </StoreSelectorContext.Provider>
    );
  }
}

export default withCurrentProduct(connect(StoreSelector));
