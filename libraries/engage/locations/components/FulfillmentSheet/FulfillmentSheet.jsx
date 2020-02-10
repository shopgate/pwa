import { hot } from 'react-hot-loader/root';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
// eslint-disable-next-line import/named
import { logger } from '../../../core';
import { withCurrentProduct } from '../../../core/hocs/withCurrentProduct';
import { i18n } from '../../../core/helpers/i18n';
import SheetDrawer from '../../../components/SheetDrawer';
import { StoreList } from '../StoreList';
import { ReserveForm } from '../ReserveForm';
import { ReservationSuccess, ReservationError } from '../ReservationResponses';
import { sheet } from './FulfillmentSheet.style';
import connect from './FulfillmentSheet.connector';
import FulfillmentContext from '../context';

const EVENT_SET_OPEN = 'event.setOpen';
const EVENT_SET_CLOSED = 'event.setClosed';
const STAGES = [
  'select-store',
  'form',
  'user',
];
const STAGE_TITLES = [
  i18n.text('locations.headline'),
  i18n.text('locations.place_reservation'),
  {
    success: i18n.text('locations.success_heading'),
    error: i18n.text('locations.error_heading'),
  },
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
    stage: PropTypes.number,
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
    stage: 1,
    storeFormInput: () => { },
    userInput: null,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    UIEvents.addListener(EVENT_SET_OPEN, this.handleSetOpen);
    UIEvents.addListener(EVENT_SET_CLOSED, this.handleSetClosed);
    this.callback = () => { };
  }

  state = {
    isOpen: false,
    stage: STAGES[this.props.stage - 1],
    title: STAGE_TITLES[this.props.stage - 1],
    orderNumbers: null,
    errors: null,
  };

  /**
   * Deregisters the event listeners.
   */
  componentWillUnmount() {
    UIEvents.removeListener(EVENT_SET_OPEN, this.handleSetOpen);
    UIEvents.removeListener(EVENT_SET_CLOSED, this.handleSetClosed);
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
    const { stage } = this.props;

    this.setState({
      isOpen: false,
      stage: STAGES[stage - 1],
      title: STAGE_TITLES[stage - 1],
      orderNumbers: null,
      errors: null,
    });

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
  handleSelectLocation = (params) => {
    const {
      code, name, addressCode, visibleInventory,
    } = params;
    const {
      selectLocation,
      product,
    } = this.props;
    const location = {
      code,
      name,
      addressCode,
      visibleInventory,
      productCode: product.id,
    };

    selectLocation(location);
    setTimeout(() => {
      this.setState({
        stage: STAGES[1],
        title: STAGE_TITLES[1],
      });
    }, 300);
  }

  /**
   * Handle a success response.
   * @param {Array} orderNumbers The order numbers.
   */
  handleSuccess = (orderNumbers) => {
    this.setState({
      stage: STAGES[2],
      title: STAGE_TITLES[2].success,
      orderNumbers,
    });
  }

  /**
   * @param {Array} errors The errors.
   */
  handleError = (errors) => {
    this.setState({
      stage: STAGES[2],
      title: STAGE_TITLES[2].error,
      orderNumbers: null,
      errors,
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

      if (response.errors.length > 0) {
        this.handleError(response.errors);
        return;
      }

      this.handleSuccess(response.orderNumbers);
    } catch (error) {
      logger.error(error);
      this.handleError([error.message]);
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      product, locations, selectedVariants, userInput,
    } = this.props;
    const {
      isOpen, stage, title, orderNumbers, errors,
    } = this.state;

    const contextValue = {
      selectLocation: this.handleSelectLocation,
      sendReservation: this.handleSendReservation,
      product,
      locations,
      selectedVariants,
      userInput,
      orderNumbers,
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
            {(stage === STAGES[2] && orderNumbers !== null) && (
              <ReservationSuccess />
            )}
            {(stage === STAGES[2] && errors !== null) && (
              <ReservationError />
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
