// @flow
import * as React from 'react';
import {
  logger, i18n, UIEvents,
} from '../../core';
import { withCurrentProduct } from '../../core/hocs/withCurrentProduct';
import { FulfillmentContext, type FulfillmentContextProps } from '../locations.context';
import { FulfillmentPathSelector } from '../components/FulfillmentPathSelector';
import {
  STAGE_SELECT_STORE,
  STAGE_RESERVE_FORM,
  STAGE_RESPONSE_SUCCESS,
  STAGE_RESPONSE_ERROR,
  STAGE_FULFILLMENT_METHOD,
  FULFILLMENT_PATH_QUICK_RESERVE,
  FULFILLMENT_PATH_MULTI_LINE_RESERVE,
  PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  PRODUCT_FULFILLMENT_METHOD_ROPIS,
} from '../constants';
import {
  type Location,
  type SheetOpenParams,
  type SheetStage,
  type FulfillmentPath,
  type ReservationFormValues,
  type SheetCallbackFn,
} from '../locations.types';
import {
  type OwnProps,
  type StateProps,
  type DispatchProps,
} from './FulfillmentProvider.types';
import connect from './FulfillmentProvider.connector';

const EVENT_SET_OPEN = 'FulfillmentProvider.setOpen';

type Props = OwnProps & StateProps & DispatchProps;

let callback: SheetCallbackFn | null;

/**
 * Provides the fulfillment context.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function FulfillmentProvider(props: Props) {
  const {
    children,
    locations,
    product: propsProduct,
    userInput,
    fulfillmentPaths,
    selectLocation,
    submitReservation,
    storeFormInput,
    addProductsToCart,
    updateProductsInCart,
    open = false,
  } = props;
  const [fulfillmentPath, setFulfillmentPath] = React.useState<FulfillmentPath | null>(null);
  const [changeOnly, setChangeOnly] = React.useState(props.changeOnly);
  const [isOpen, setIsOpen] = React.useState(open);
  const [stage, setStage] = React.useState<SheetStage>(props.stage || STAGE_SELECT_STORE);
  const [orderNumbers, setOrderNumbers] = React.useState<string[] | null>(null);
  const [errors, setErrors] = React.useState<string[] | null>(null);
  const [product, setProduct] = React.useState(propsProduct);
  const [isChangeFulfillment, setIsChangeFulfillment] = React.useState(false);
  const [cartItem, setCartItem] = React.useState(null);

  const title = React.useMemo<string>(() => {
    if (props.title !== null) {
      return i18n.text(props.title);
    }

    switch (stage) {
      default:
      case STAGE_SELECT_STORE:
        return i18n.text('locations.headline');
      case STAGE_RESERVE_FORM:
        return i18n.text('locations.place_reservation');
      case STAGE_RESPONSE_SUCCESS:
        return i18n.text('locations.success_heading');
      case STAGE_RESPONSE_ERROR:
        return i18n.text('locations.error_heading');
      case STAGE_FULFILLMENT_METHOD:
        return i18n.text('locations.change_fulfillment_method');
    }
  }, [props.title, stage]);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  /**
   * Checks whether the given stage is currently set.
   * @param {string} inputStage The stage to check for.
   * @returns {boolean}
   */
  function isStage(inputStage: SheetStage) {
    return inputStage === stage;
  }

  /**
   * Handles opening of the sheet.
   * @param {Object} params The sheet open parameters.
   */
  function handleOpen(params: SheetOpenParams) {
    setIsOpen(true);
    setStage(prevState => params.stage || prevState);
    setChangeOnly(prevState => params.changeOnly || prevState);
    setFulfillmentPath(prevState => params.fulfillmentPath || prevState);
    callback = params.callback || null;
  }

  /**
   * Is called when the sheet closed.
   * @param {Object} [location=null] The selected location.
   * @param {string} [productId=null] The product ID.
   */
  function handleClose(location: Location | null = null, productId: string | null = null) {
    let orderSuccess = true;

    if (isStage(STAGE_RESPONSE_ERROR)) {
      orderSuccess = errors === null;
    }

    if (props.onClose) {
      props.onClose(location, productId, orderSuccess);
    } else if (callback) {
      callback(location, productId, orderSuccess);
      callback = null;
    }

    setIsOpen(false);
    setStage(STAGE_SELECT_STORE);
    setOrderNumbers(null);
    setErrors(null);
    setIsChangeFulfillment(false);
  }

  React.useEffect(() => {
    UIEvents.addListener(EVENT_SET_OPEN, handleOpen);
    return () => {
      UIEvents.removeListener(EVENT_SET_OPEN, handleOpen);
    };
  }, []);

  /**
   * Handles the sending of the reservation.
   * @param {Object} values The form values.
   */
  async function sendReservation(values: ReservationFormValues) {
    // Store the user's form in the user data.
    storeFormInput(values);

    try {
      const response = await submitReservation(values, product);

      if (response.errors && response.errors.length > 0) {
        setStage(STAGE_RESPONSE_ERROR);
        setOrderNumbers(null);
        setErrors(response.errors);
      }

      setStage(STAGE_RESPONSE_SUCCESS);
      setOrderNumbers(response.orderNumbers);
      setErrors(null);
    } catch (error) {
      logger.error(error);
      setStage(STAGE_RESPONSE_ERROR);
      setOrderNumbers(null);
      setErrors([error.message]);
    }
  }

  /**
   * Handles multiline reservation.
   * @param {Object} location The selected location.
   */
  function handleMultilineReservation(location: Location) {
    if (product === null || location.code === null) {
      return;
    }

    const fulfillment = {
      method: PRODUCT_FULFILLMENT_METHOD_ROPIS, // TODO: make this dynamic.
      location: {
        code: location.code,
        name: location.name || '',
      },
    };

    if (isChangeFulfillment && cartItem) {
      updateProductsInCart([{
        quantity: 1,
        cartItemId: cartItem.id,
        fulfillment,
      }]);
    } else {
      addProductsToCart([{
        productId: product.id,
        quantity: 1,
        fulfillment,
      }]);
    }

    handleClose(location, product.id);
  }

  /**
   * Handles quick reservation.
   */
  function handleQuickReservation() {
    setStage(STAGE_RESERVE_FORM);
  }

  /**
   * Handles the selection of a store location from the sheet.
   * @param {Object} location The selected location.
   */
  function handleSelectLocation(location: Location) {
    selectLocation({
      code: location.code,
      name: location.name,
    });

    if (changeOnly) {
      handleClose(location, product && product.id);
      return;
    }

    // No fulfillment path selected yet.
    if (fulfillmentPath === null && fulfillmentPaths.length > 1) {
      FulfillmentPathSelector.open((method: FulfillmentPath) => {
        if (!method) {
          return;
        }

        if (method === FULFILLMENT_PATH_QUICK_RESERVE) {
          handleQuickReservation();
        }

        if (method === FULFILLMENT_PATH_MULTI_LINE_RESERVE) {
          handleMultilineReservation(location);
        }
      });
      return;
    }

    if (
      fulfillmentPath === FULFILLMENT_PATH_MULTI_LINE_RESERVE
      && fulfillmentPaths.includes(FULFILLMENT_PATH_MULTI_LINE_RESERVE)
    ) {
      handleMultilineReservation(location);
      return;
    }

    if (fulfillmentPath === FULFILLMENT_PATH_QUICK_RESERVE) {
      handleQuickReservation();
    }
  }

  /**
   * @param {string} method The selected fulfillment method.
   * @param {Object} item The cart item to change.
   */
  function handleChangeFulfillmentMethod(method, item) {
    setIsChangeFulfillment(true);
    setProduct(item.product);
    setCartItem(item);

    if (
      method === PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP
      && (item.fulfillment === null || item.fulfillment.method === 'DIRECT_SHIP')
    ) {
      setFulfillmentPath(FULFILLMENT_PATH_MULTI_LINE_RESERVE);
      setStage(STAGE_SELECT_STORE);
      return;
    }

    if (method === PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP) {
      updateProductsInCart([{
        quantity: 1,
        cartItemId: item.id,
      }]);

      handleClose(null, item.product.id);
    }
  }

  const context: FulfillmentContextProps = {
    stage,
    title,
    fulfillmentPath,
    changeOnly,
    isStage,
    isOpen,
    handleOpen,
    handleClose,
    locations,
    product,
    userInput,
    fulfillmentPaths,
    selectLocation: handleSelectLocation,
    changeFulfillment: handleChangeFulfillmentMethod,
    sendReservation,
    orderNumbers,
    errors,
    meta: props.meta || undefined,
  };

  return (
    <FulfillmentContext.Provider value={context}>
      {children}
    </FulfillmentContext.Provider>
  );
}

FulfillmentProvider.defaultProps = {
  open: false,
  changeOnly: false,
  title: null,
};

const FulfillmentProviderWrapped = withCurrentProduct<Props>(connect(FulfillmentProvider));

/**
 * Opens the sheet that is wrapped inside the provider.
 * @param {Object} params The opening parameters.
 * @property {Function} [params.callback] A callback function that's when the sheet closes.
 * @property {string} [params.stage] A specific stage to show.
 * @property {string} [params.fulfillmentPath] The fulfillment path that was chosen.
 * @property {boolean} [params.changeOnly=false] Whether only the location will be changed.
 */
export function openSheet(params: SheetOpenParams): void {
  UIEvents.emit(EVENT_SET_OPEN, params);
}

export default FulfillmentProviderWrapped;
