import { hot } from 'react-hot-loader/root';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { withCurrentProduct } from '../../../core/hocs/withCurrentProduct';
import { i18n } from '../../../core/helpers/i18n';
import SheetDrawer from '../../../components/SheetDrawer';
import { sheet } from './style';
import { StoreList } from '../StoreList';
import { ReserveForm } from '../ReserveForm';
import connect from './connector';
import FulfillmentContext from '../context';

const EVENT_SET_OPEN = 'event.setOpen';
const EVENT_SET_CLOSED = 'event.setClosed';
const STAGES = [
  'select-store',
  'form',
  'user',
];

/**
 * Renders the store selector sheet.
 */
class FulfillmentSheet extends PureComponent {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape()),
    product: PropTypes.shape(),
    selectedVariants: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    selectLocation: PropTypes.func,
    storeFormInput: PropTypes.func,
    submitReservation: PropTypes.func,
    userInput: PropTypes.shape(),
  }

  static defaultProps = {
    locations: null,
    product: null,
    selectedVariants: [],
    selectLocation: () => { },
    submitReservation: () => { },
    storeFormInput: () => { },
    userInput: null,
  }

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
    stage: STAGES[0],
    title: i18n.text('product.location.headline'),
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
    this.setState({
      stage: STAGES[1],
      title: i18n.text('product.location.place_reservation'),
    });
  }

  /**
   * Handles the sending of the reservation.
   * @param {Object} values The form values.
   */
  handleSendReservation = async (values) => {
    const { submitReservation, product, storeFormInput } = this.props;

    // Store the user's form in the user data.
    storeFormInput(values);

    try {
      const response = await submitReservation(values, product);
      console.warn('handleSendReservation', response);
    } catch (error) {
      console.error('handleSendReservation', error);
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      product, locations, selectedVariants, userInput,
    } = this.props;
    const { isOpen, stage, title } = this.state;

    const contextValue = {
      selectLocation: this.handleSelectLocation,
      sendReservation: this.handleSendReservation,
      product,
      locations,
      selectedVariants,
      userInput,
    };

    return (
      <FulfillmentContext.Provider value={contextValue}>
        <SheetDrawer isOpen={isOpen} title={title} onClose={this.handleSetClosed}>
          <div className={sheet}>
            {stage === STAGES[0] && (
              <StoreList />
            )}
            {stage === STAGES[1] && (
              <ReserveForm />
            )}
            {stage === STAGES[2] && (
              <div>result</div>
            )}
          </div>
        </SheetDrawer>
      </FulfillmentContext.Provider>
    );
  }
}

const FulfillmentSheetWrapped = withCurrentProduct(connect(FulfillmentSheet));

/**
 * Opens the store selector sheet.
 * @param {Function} [callback=null] A callback that will be called once the sheet closes.
 */
FulfillmentSheetWrapped.open = (callback = null) => {
  UIEvents.emit(EVENT_SET_OPEN, callback);
};

/**
 * Closes the store selector sheet.
 */
FulfillmentSheetWrapped.close = () => {
  UIEvents.emit(EVENT_SET_CLOSED);
};

export default hot(FulfillmentSheetWrapped);
