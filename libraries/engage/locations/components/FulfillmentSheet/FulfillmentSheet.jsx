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
import {
  FULFILLMENT_PATH_QUICK_RESERVE,
  FULFILLMENT_PATH_MULTI_LINE_RESERVE,
} from '../../constants';
import { FulfillmentPathSelector } from '../FulfillmentPathSelector';

const EVENT_SET_OPEN = 'event.setOpen';
const EVENT_SET_CLOSED = 'event.setClosed';

/**
 * Renders the store selector sheet.
 */
class FulfillmentSheet extends PureComponent {
  static propTypes = {
    addProductsToCart: PropTypes.func,
    locations: PropTypes.arrayOf(PropTypes.shape()),
    product: PropTypes.shape(),
    selectLocation: PropTypes.func,
    settings: PropTypes.shape(),
    stage: PropTypes.number,
    storeFormInput: PropTypes.func,
    submitReservation: PropTypes.func,
    userInput: PropTypes.shape(),
  }

  static defaultProps = {
    addProductsToCart: () => { },
    locations: null,
    product: null,
    selectLocation: () => { },
    settings: {},
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

    this.STAGES = [
      'select-store',
      'form',
      'user',
    ];
    this.STAGE_TITLES = [
      i18n.text('locations.headline'),
      i18n.text('locations.place_reservation'),
      {
        success: i18n.text('locations.success_heading'),
        error: i18n.text('locations.error_heading'),
      },
    ];

    this.state = {
      isOpen: false,
      stage: this.STAGES[this.props.stage - 1],
      title: this.STAGE_TITLES[this.props.stage - 1],
      orderNumbers: null,
      errors: null,
      fulfillmentPath: null,
    };
  }

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
   * @param {number} [stage=0] The stage to start on.
   * @param {string} [fulfillmentPath=null] The fulfillment path.
   */
  handleSetOpen = (callback = null, stage = 0, fulfillmentPath = null) => {
    if (callback !== null) {
      this.callback = callback;
    }

    this.setState({
      isOpen: true,
      stage: this.STAGES[stage],
      title: this.STAGE_TITLES[stage],
      fulfillmentPath,
    });
  }

  /**
   * Closes the store selector sheet.
   * @param {Object} [location=null] The selected location.
   */
  handleSetClosed = (location = null) => {
    const { stage } = this.props;

    let orderSuccess;

    if (this.state.stage === this.STAGES[2]) {
      orderSuccess = this.state.errors === null;
    }

    this.callback(location, orderSuccess);
    this.callback = () => { };

    this.setState({
      isOpen: false,
      stage: this.STAGES[stage - 1],
      title: this.STAGE_TITLES[stage - 1],
      orderNumbers: null,
      errors: null,
    });
  }

  /**
   * Handles multiline reservation.
   * @param {Object} location The selected location.
   */
  handleMultilineReservation = (location) => {
    const {
      addProductsToCart,
      product,
    } = this.props;

    addProductsToCart([{
      productId: product.id,
      quantity: 1,
      fulfillment: {
        method: 'ROPIS', // TODO: make this dynamic.
        location: {
          code: location.code,
          name: location.name,
        },
      },
    }]);

    this.handleSetClosed({
      productCode: product.id,
      location,
    });
  }

  /**
   * Handles quick reservation.
   */
  handleQuickReservation = () => {
    setTimeout(() => {
      this.setState({
        stage: this.STAGES[1],
        title: this.STAGE_TITLES[1],
      });
    }, 300);
  }

  /**
   * Handles the selection of a store location from the sheet.
   * @param {Object} location The selected location.
   */
  handleSelectLocation = (location) => {
    const {
      selectLocation,
      settings: { enabledFulfillmentMethodSelectionForEngage: fulfillmentMethods = [] },
    } = this.props;
    const { fulfillmentPath } = this.state;

    // Dispatch action for user selection
    selectLocation({
      code: location.code,
      name: location.name,
    });

    // No fulfillment path selected yet.
    if (fulfillmentPath === null && fulfillmentMethods.length > 1) {
      FulfillmentPathSelector.open((method) => {
        if (method === FULFILLMENT_PATH_QUICK_RESERVE) {
          this.handleQuickReservation();
        }

        if (method === FULFILLMENT_PATH_MULTI_LINE_RESERVE) {
          this.handleMultilineReservation(location);
        }
      });

      return;
    }

    if (
      fulfillmentPath === FULFILLMENT_PATH_MULTI_LINE_RESERVE
      && fulfillmentMethods.includes('multiLineReserve')
    ) {
      this.handleMultilineReservation(location);
      return;
    }

    if (fulfillmentPath === FULFILLMENT_PATH_QUICK_RESERVE) {
      this.handleQuickReservation();
    }
  }

  /**
   * Handle a success response.
   * @param {Array} orderNumbers The order numbers.
   */
  handleSuccess = (orderNumbers) => {
    this.setState({
      stage: this.STAGES[2],
      title: this.STAGE_TITLES[2].success,
      orderNumbers,
    });
  }

  /**
   * @param {Array} errors The errors.
   */
  handleError = (errors) => {
    this.setState({
      stage: this.STAGES[2],
      title: this.STAGE_TITLES[2].error,
      orderNumbers: null,
      errors,
    });
  }

  /**
   * Handles the sending of the reservation.
   * @param {Object} values The form values.
   */
  handleSendReservation = async (values) => {
    const {
      submitReservation, product, storeFormInput,
    } = this.props;

    // Store the user's form in the user data.
    storeFormInput(values);

    try {
      const response = await submitReservation(values, product);

      if (response.errors.length > 0) {
        this.handleError(response.errors);
      }

      this.handleSuccess(response.orderNumbers);
    } catch (error) {
      logger.error(error);
      this.handleError([error.message]);
    }
  }

  /**
   * Whether to show the store list.
   * @returns {boolean}
   */
  isStoreList = () => {
    const { stage } = this.state;
    return (stage === this.STAGES[0]);
  }

  /**
   * Whether to show the reservation form.
   * @returns {boolean}
   */
  isReservationForm = () => {
    const { stage } = this.state;
    return (stage === this.STAGES[1]);
  }

  /**
   * Whether to show the reservation success page.
   * @returns {boolean}
   */
  isReservationSuccess = () => {
    const { stage, orderNumbers } = this.state;
    return (stage === this.STAGES[2] && orderNumbers !== null && !!orderNumbers.find(Boolean));
  }

  /**
  * Whether to show the reservation error page.
  * @returns {boolean}
  */
  isReservationError = () => {
    const { stage, errors } = this.state;
    return (stage === this.STAGES[2] && errors !== null);
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { product, locations, userInput } = this.props;
    const { isOpen, title, orderNumbers } = this.state;

    const contextValue = {
      selectLocation: this.handleSelectLocation,
      sendReservation: this.handleSendReservation,
      product,
      locations,
      userInput,
      orderNumbers,
    };

    return (
      <FulfillmentContext.Provider value={contextValue}>
        <SheetDrawer isOpen={isOpen} title={title} onDidClose={this.handleSetClosed}>
          <div className={sheet}>
            {this.isStoreList() && (
              <StoreList />
            )}
            {this.isReservationForm() && (
              <ReserveForm />
            )}
            {this.isReservationSuccess() && (
              <ReservationSuccess />
            )}
            {this.isReservationError() && (
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
 * @param {number} [stage=0] The stage to start on.
 * @param {string} [fulfillmentPath= null] Determines the fulfillment path
 */
FulfillmentSheetWrapped.open = (callback = null, stage = 0, fulfillmentPath = null) => {
  UIEvents.emit(EVENT_SET_OPEN, callback, stage, fulfillmentPath);
};

/**
 * Closes the store selector sheet.
 */
FulfillmentSheetWrapped.close = () => {
  UIEvents.emit(EVENT_SET_CLOSED);
};

export default hot(FulfillmentSheetWrapped);
