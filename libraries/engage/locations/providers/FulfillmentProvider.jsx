import React, {
  useState, useMemo, useRef, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  logger, i18n, UIEvents,
} from '../../core';
import { withCurrentProduct } from '../../core/hocs/withCurrentProduct';
import { FulfillmentContext } from '../locations.context';
import { FulfillmentPathSelector } from '../components/FulfillmentPathSelector';
import {
  STAGE_SELECT_STORE,
  STAGE_RESERVE_FORM,
  STAGE_RESPONSE_SUCCESS,
  STAGE_RESPONSE_ERROR,
  STAGE_FULFILLMENT_METHOD,
  QUICK_RESERVE,
  MULTI_LINE_RESERVE,
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
} from '../constants';
import connect from './FulfillmentProvider.connector';

/**
 * @typedef {import('./FulfillmentProvider.types').OwnProps} OwnProps
 * @typedef {import('./FulfillmentProvider.types').StateProps} StateProps
 * @typedef {import('./FulfillmentProvider.types').DispatchProps} DispatchProps
 * @typedef {import('../locations.types').SheetOpenParams} SheetOpenParams
 * @typedef {import('../locations.types').SheetStage} SheetStage
 * @typedef {import('../locations.types').Location} Location
 * @typedef {import('../locations.types').ReservationFormValues} ReservationFormValues
 * @typedef {import('../locations.types').FulfillmentPath} FulfillmentPath
 */

/**
 * @typedef {OwnProps & StateProps & DispatchProps} Props
 */

export const EVENT_SET_OPEN = 'FulfillmentProvider.setOpen';

let callback = null;

/**
 * Provides the fulfillment context.
 * @param {Props} props The component props.
 * @returns {JSX.Element} The rendered component.
 */
const FulfillmentProvider = (props) => {
  const {
    children,
    locations,
    baseProduct: propsBaseProduct,
    product: propsProduct,
    location: productLocation,
    inventory,
    userInput,
    fulfillmentMethod: defaultFulfillmentMethod,
    fulfillmentPath: defaultFulfillmentPath,
    fulfillmentPaths,
    fulfillmentMethods,
    enabledFulfillmentMethods,
    shopSettings,
    selectLocation,
    submitReservation,
    storeFormInput,
    updateProductsInCart,
    isFetching,
    noInventory = false,
    open = false,
    noLocationSelection = false,
    isStoreFinder = false,
    isCart = false,
    isInitialized: defaultIsInitialized,
    updatePreferredLocation,
    restrictMultiLocationOrders = false,
    cartProducts = [],
    showModal,
    fulfillmentSchedulingEnabled = null,
    activeFulfillmentSlot = null,
    activeFulfillmentSlotLocationCode = null,
  } = props;

  const [fulfillmentPath, setFulfillmentPath] = useState(defaultFulfillmentPath || null);
  const [changeOnly, setChangeOnly] = useState(props.changeOnly);
  const [isOpen, setIsOpen] = useState(open);
  const [stage, setStage] = useState(props.stage || null);
  const [fulfillmentMethod, setFulfillmentMethod] = useState(null);
  const [orderNumbers, setOrderNumbers] = useState(null);
  const [errors, setErrors] = useState(null);
  const [product, setProduct] = useState(propsProduct);
  const [isChangeFulfillment, setIsChangeFulfillment] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [storeFinderLocation, setStoreFinderLocation] = useState(productLocation);
  const [isLoading, setIsLoading] = useState(!isFetching);
  const isInitialized = useRef(defaultIsInitialized);

  useEffect(() => {
    if (defaultFulfillmentMethod) {
      setFulfillmentMethod(defaultFulfillmentMethod);
    }
  }, [defaultFulfillmentMethod]);

  const title = useMemo(() => {
    if (props.title !== null) {
      return i18n.text(props.title);
    }

    switch (stage) {
      case STAGE_RESERVE_FORM:
        return i18n.text('locations.place_reservation');
      case STAGE_RESPONSE_SUCCESS:
        return i18n.text('locations.success_heading');
      case STAGE_RESPONSE_ERROR:
        return i18n.text('locations.error_heading');
      case STAGE_FULFILLMENT_METHOD:
        return i18n.text('locations.change_fulfillment_method');
      case STAGE_SELECT_STORE:
      default:
        return i18n.text('locations.headline');
    }
  }, [props.title, stage]);

  /** Effects for updating a state based on new props */
  useEffect(() => setIsOpen(open), [open]);
  useEffect(() => setProduct(propsProduct), [propsProduct]);
  useEffect(() => {
    // eslint-disable-next-line require-jsdoc
    const exec = async () => {
      if (updatePreferredLocation && productLocation && !isInitialized.current) {
        isInitialized.current = true;
        await selectLocation({
          location: productLocation,
          skipLocationSync: true,
        });
      }
    };

    exec();
  }, [productLocation, selectLocation, updatePreferredLocation]);

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching]);

  /**
   * Checks whether the given stage is currently set.
   * @param {SheetStage} inputStage The stage to check for.
   * @returns {boolean}
   */
  const isStage = useCallback(inputStage => inputStage === stage, [stage]);

  /**
   * Handles opening of the sheet.
   * @param {SheetOpenParams} params The sheet open parameters.
   */
  const handleOpen = (params) => {
    setIsOpen(true);
    setStage(prevState => params.stage || prevState);
    setChangeOnly(prevState => params.changeOnly || prevState);
    setFulfillmentPath(prevState => params.fulfillmentPath || prevState);
    callback = params.callback || null;
  };

  /**
   * Handles the closing of the sheet.
   * @param {Location|null} location - The selected location or null if no location is selected.
   * @param {string|null} productId - The product ID or null if no product is provided.
   * @returns {void}
   */
  const handleClose = useCallback((location = null, productId = null) => {
    let orderSuccess = true;

    if (isStage(STAGE_RESPONSE_ERROR)) {
      orderSuccess = errors === null;
    }

    if (isStage(STAGE_RESERVE_FORM)) {
      orderSuccess = null;
    }

    if (props.onClose) {
      props.onClose(location, productId, orderSuccess);
    } else if (callback) {
      callback(location, productId, orderSuccess);
      callback = null;
    }

    setIsOpen(false);
    setStage(null);
    setOrderNumbers(null);
    setErrors(null);
    setIsChangeFulfillment(false);
    setFulfillmentMethod(null);
  }, [errors, isStage, props]);

  useEffect(() => {
    UIEvents.addListener(EVENT_SET_OPEN, handleOpen);
    return () => {
      UIEvents.removeListener(EVENT_SET_OPEN, handleOpen);
    };
  }, []);

  /**
   * Handles the sending of the reservation.
   * @param {ReservationFormValues} values The reservation form values.
   */
  const sendReservation = useCallback(async (values) => {
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

    // Store the user's form in the user data.
    storeFormInput(values);
  }, [product, storeFormInput, submitReservation]);

  /**
   * @param {Location} location The selected location.
   * @returns {boolean}
   */
  const confirmSelection = useCallback(async (location) => {
    const { code, name } = location;

    const ropeCartProducts = cartProducts
      .filter(cartProduct => [ROPIS, BOPIS].includes(cartProduct?.fulfillment?.method));

    if (!restrictMultiLocationOrders || ropeCartProducts.length === 0) {
      return true;
    }

    if (isCart && ropeCartProducts.length === 1) {
      // Location changed for the one and only cart item
      return true;
    }

    const cartHasDifferentCodes = !!ropeCartProducts
      .map(({ fulfillment }) => fulfillment?.location?.code)
      .filter(Boolean)
      .filter(cartProductCode => cartProductCode !== code).length;

    if (ropeCartProducts.length >= 1 && !cartHasDifferentCodes) {
      return true;
    }

    const confirmed = await showModal({
      title: 'locations.multi_location_modal.title',
      message: 'locations.multi_location_modal.message',
      confirm: 'locations.multi_location_modal.change_store',
      dismiss: 'common.cancel',
    });

    if (confirmed && ropeCartProducts.length) {
      const updateData = ropeCartProducts.map(({ id: cartItemId, fulfillment }) => ({
        cartItemId,
        fulfillment: {
          method: fulfillment?.method,
          location: {
            code,
            name: name || '',
          },
        },
      }));
      setIsLoading(true);
      await updateProductsInCart(updateData);
      setIsLoading(false);
    }

    return confirmed;
  }, [cartProducts, isCart, restrictMultiLocationOrders, showModal, updateProductsInCart]);

  /**
   * Handles multiline reservation.
   * @param {Location} location The selected location.
   */
  const handleMultilineReservation = useCallback((location) => {
    if (product === null || location.code === null) {
      return;
    }

    const fulfillment = {
      method: fulfillmentMethod,
      location: {
        code: location.code,
        name: location.name || '',
      },
      ...(
        fulfillmentSchedulingEnabled &&
        activeFulfillmentSlotLocationCode === location.code &&
        activeFulfillmentSlot?.id ? {
            slotId: activeFulfillmentSlot.id,
          } : null),
    };

    if (isChangeFulfillment && cartItem) {
      updateProductsInCart([{
        quantity: cartItem.quantity,
        cartItemId: cartItem.id,
        fulfillment,
      }]);
    }

    handleClose(location, product.id);
  }, [
    activeFulfillmentSlot.id,
    activeFulfillmentSlotLocationCode,
    cartItem,
    fulfillmentMethod,
    fulfillmentSchedulingEnabled,
    handleClose,
    isChangeFulfillment,
    product,
    updateProductsInCart,
  ]);

  /**
   * Handles quick reservation.
   */
  function handleQuickReservation() {
    setStage(STAGE_RESERVE_FORM);
  }

  /**
   * Handles the selection of a store location from the sheet.
   * @param {Location} location The selected location.
   * @returns {Promise<void>}
   */
  const handleSelectLocation = useCallback(async (location) => {
    if (isLoading) {
      return;
    }

    let selectionConfirmed;

    if (updatePreferredLocation) {
      selectionConfirmed = await confirmSelection(location);

      if (selectionConfirmed) {
        await selectLocation({
          location: {
            code: location.code,
            name: location.name,
          },
        });
      }
    }

    if (changeOnly) {
      if (selectionConfirmed) {
        handleClose(location, product && product.id);
      }
      return;
    }

    /**
     * Select the reservation method strategy.
     * @param {string|FulfillmentPath} method The reservation method.
     * @param {Location} storeLocation The selected store location.
     */
    const handleReservationMethod = (method, storeLocation) => {
      if (!method) {
        return;
      }

      if (method === QUICK_RESERVE) {
        handleQuickReservation();
      }

      if (method === MULTI_LINE_RESERVE) {
        handleMultilineReservation(storeLocation);
      }
    };

    // No fulfillment path selected yet.
    if (fulfillmentPath === null) {
      if (fulfillmentPaths.length > 1) {
        /**
         * @param {FulfillmentPath} method - The selected fulfillment path.
         */
        FulfillmentPathSelector.open((method) => {
          if (!method) {
            return;
          }

          handleReservationMethod(method, location);
        });
      } else if (fulfillmentPaths.length === 1) {
        handleReservationMethod(fulfillmentPaths[0], location);
      }

      return;
    }

    if (
      fulfillmentPath === MULTI_LINE_RESERVE
      && fulfillmentPaths.includes(MULTI_LINE_RESERVE)
    ) {
      handleMultilineReservation(location);
      return;
    }

    if (fulfillmentPath === QUICK_RESERVE) {
      handleQuickReservation();
    }
  }, [
    changeOnly,
    confirmSelection,
    fulfillmentPath,
    fulfillmentPaths,
    handleClose,
    handleMultilineReservation,
    isLoading,
    product,
    selectLocation,
    updatePreferredLocation,
  ]);

  /**
   * @param {string} method The selected fulfillment method.
   * @param {Object} item The cart item to change.
   */
  const handleChangeFulfillmentMethod = useCallback((method, item) => {
    logger.assert(item.product.id === product.id, 'Change fulfillment method is called with unexpected product id');

    setIsChangeFulfillment(true);
    setCartItem(item);

    if (
      [ROPIS, BOPIS].includes(method)
      && (item.fulfillment === null || item.fulfillment.method === DIRECT_SHIP)
    ) {
      /**
       * When the fulfillment method of the current cart item was DIRECT_SHIP before, and is
       * switched to a ROPE method, the customer needs to pick a store for the item.
       */
      setFulfillmentPath(MULTI_LINE_RESERVE);
      setStage(STAGE_SELECT_STORE);
      setFulfillmentMethod(method);
      setIsOpen(true);
      return;
    }

    if ([DIRECT_SHIP, ROPIS, BOPIS].includes(method)) {
      updateProductsInCart([{
        quantity: item.quantity,
        cartItemId: item.id,
        fulfillment: { method },
      }]);

      handleClose(null, item.product.id);
    }
  }, [handleClose, product.id, updateProductsInCart]);

  const handleSelectStoreFinderLocation = useCallback((location) => {
    setStoreFinderLocation(location);
  }, []);

  const context = useMemo(() => ({
    stage,
    title,
    fulfillmentPath,
    changeOnly,
    isStage,
    isOpen,
    handleOpen,
    handleClose,
    locations,
    inventory,
    baseProduct: propsBaseProduct,
    product,
    location: productLocation,
    storeFinderLocation,
    userInput,
    fulfillmentPaths,
    fulfillmentMethods,
    enabledFulfillmentMethods,
    shopSettings,
    selectLocation: handleSelectLocation,
    selectStoreFinderLocation: handleSelectStoreFinderLocation,
    changeFulfillment: handleChangeFulfillmentMethod,
    sendReservation,
    orderNumbers,
    errors,
    noInventory,
    noLocationSelection,
    isStoreFinder,
    isFetching,
    isLoading,
    setIsLoading,
    meta: props.meta || undefined,
  }), [
    changeOnly,
    enabledFulfillmentMethods,
    errors,
    fulfillmentMethods,
    fulfillmentPath,
    fulfillmentPaths,
    handleChangeFulfillmentMethod,
    handleClose,
    handleSelectLocation,
    handleSelectStoreFinderLocation,
    inventory,
    isFetching,
    isLoading,
    isOpen,
    isStage,
    isStoreFinder,
    locations,
    noInventory,
    noLocationSelection,
    orderNumbers,
    product,
    productLocation,
    props.meta,
    propsBaseProduct,
    sendReservation,
    shopSettings,
    stage,
    storeFinderLocation,
    title,
    userInput,
  ]);

  return (
    <FulfillmentContext.Provider value={context}>
      {children}
    </FulfillmentContext.Provider>
  );
};

FulfillmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
  selectLocation: PropTypes.func.isRequired,
  storeFormInput: PropTypes.func.isRequired,
  submitReservation: PropTypes.func.isRequired,
  updateProductsInCart: PropTypes.func.isRequired,
  activeFulfillmentSlot: PropTypes.shape({
    id: PropTypes.string,
  }),
  activeFulfillmentSlotLocationCode: PropTypes.string,
  baseProduct: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  cartProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fulfillment: PropTypes.shape({
        method: PropTypes.string,
        location: PropTypes.shape({
          code: PropTypes.string,
          name: PropTypes.string,
        }),
      }),
    })
  ),
  changeOnly: PropTypes.bool,
  enabledFulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  fulfillmentMethod: PropTypes.string,
  fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  fulfillmentPath: PropTypes.string,
  fulfillmentPaths: PropTypes.arrayOf(PropTypes.string),
  fulfillmentSchedulingEnabled: PropTypes.bool,
  inventory: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isCart: PropTypes.bool,
  isFetching: PropTypes.bool,
  isInitialized: PropTypes.bool,
  isStoreFinder: PropTypes.bool,
  location: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  }),
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  meta: PropTypes.shape(),
  noInventory: PropTypes.bool,
  noLocationSelection: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  restrictMultiLocationOrders: PropTypes.bool,
  shopSettings: PropTypes.shape({
    supportedCountries: PropTypes.arrayOf(PropTypes.string),
    countrySortOrder: PropTypes.arrayOf(PropTypes.string),
  }),
  showModal: PropTypes.func,
  stage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  updatePreferredLocation: PropTypes.bool,
  userInput: PropTypes.shape({
    field: PropTypes.string,
    value: PropTypes.string,
  }),
};

FulfillmentProvider.defaultProps = {
  open: false,
  changeOnly: false,
  updatePreferredLocation: true,
  fulfillmentMethods: null,
  title: null,
  activeFulfillmentSlot: null,
  activeFulfillmentSlotLocationCode: null,
  baseProduct: null,
  cartProducts: [],
  enabledFulfillmentMethods: [],
  fulfillmentMethod: null,
  fulfillmentPath: null,
  fulfillmentPaths: [],
  fulfillmentSchedulingEnabled: false,
  inventory: null,
  isCart: false,
  isFetching: false,
  isInitialized: false,
  isStoreFinder: false,
  location: null,
  locations: [],
  noInventory: false,
  noLocationSelection: false,
  product: null,
  restrictMultiLocationOrders: false,
  shopSettings: null,
  showModal: null,
  userInput: null,
  stage: null,
  onClose: null,
  meta: null,
};

const FulfillmentProviderWrapped = withCurrentProduct(connect(FulfillmentProvider));

/**
 * Opens the sheet that is wrapped inside the provider.
 * @param {SheetOpenParams} params The opening parameters.
 */
export const openSheet = (params) => {
  UIEvents.emit(EVENT_SET_OPEN, params);
};

export default FulfillmentProviderWrapped;
