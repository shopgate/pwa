// @flow
import snakeCase from 'lodash/snakeCase';
import {
  makeGetMerchantSettings, i18n, getPlatform, getUserAgent,
} from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  getCurrency, getCartItems, getSubTotal, getGrandTotal,
} from '@shopgate/engage/cart';
import { getProductDataById } from '@shopgate/engage/product';
import { makeGetUserLocation, getExternalCustomerNumberForOrder } from '../selectors';

/**
 * Creates the address sequence.
 * @param {Object} formValues The reserve form values.
 * @param {Function} getState The redux getState function.
 * @returns {Array}
 */
function createAddressSequence(formValues, getState) {
  const {
    country = appConfig.marketId,
  } = makeGetMerchantSettings()(getState());

  return [
    {
      type: 'billing',
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phone: formValues.cellPhone,
      emailAddress: formValues.email,
      country,
    },
    {
      type: 'pickup',
      firstName: formValues.firstName2,
      lastName: formValues.lastName2,
      phone: formValues.cellPhone2,
      emailAddress: formValues.email2,
      country,
    },
  ];
}

/**
 * Retrieves the featured image for a product. If the product doesn't have a featured image
 * and is a child product, the featured image of the base product is retrieved.
 * @param {Object} product The current product.
 * @param {Function} getState The redux getState function.
 * @returns {string}
 */
function getProductImage(product, getState) {
  let image = product.featuredImageUrl;

  if (!image && product.baseProductId) {
    const baseProduct = getProductDataById(getState(), { productId: product.id });

    if (baseProduct) {
      image = baseProduct.featuredImageUrl;
    }
  }

  return image;
}

/**
 * Creates a single order line item (from quick reserve).
 * @param {Object} product The current product.
 * @param {Function} getState The redux getState function.
 * @returns {Array}
 */
function createSingleProductItems(product, getState) {
  const location = makeGetUserLocation()(getState());

  return [
    {
      code: product.id,
      quantity: 1,
      fulfillmentMethod: 'ROPIS', // TODO: Change based on the selected method.
      fulfillmentLocationCode: location.code,
      price: product.price.unitPrice,
      shipToAddressSequenceIndex: 1,
      currencyCode: product.price.currency,
      product: {
        code: product.id,
        name: product.name,
        image: getProductImage(product, getState),
        price: product.price.unitPrice,
        currencyCode: product.price.currency,
        ...product.characteristics && {
          options: product.characteristics.map(characteristic => ({
            code: String(characteristic.id),
            name: characteristic.label,
            value: {
              code: snakeCase(characteristic.value),
              name: characteristic.value,
            },
          })),
        },
      },
    },
  ];
}

/**
 * Creates the order line items.
 * @param {Function} getState The redux getState function.
 * @returns {Object[]}
 */
function createCartLineItems(getState) {
  const items = getCartItems(getState());
  const currencyCode = getCurrency(getState());

  return items.map(item => ({
    code: item.id,
    quantity: item.quantity,
    fulfillmentMethod: item.fulfillment.method,
    fulfillmentLocationCode: item.fulfillment.location.code,
    price: item.product.price.default,
    shipToAddressSequenceIndex: 1,
    currencyCode,
    product: {
      code: item.product.id,
      name: item.product.name,
      image: item.product.featuredImageUrl,
      price: item.product.price.unit,
      currencyCode,
      ...item.product.properties && {
        options: item.product.properties.map(prop => ({
          code: snakeCase(prop.label),
          name: prop.label,
          value: {
            code: snakeCase(prop.value),
            name: prop.value,
          },
        })),
      },
    },
  }));
}

/**
 * Creates a fulfillment order out of the reserve form values and the current product or the cart.
 * @param {Object} formValues The reserve form values.
 * @param {Object} product The current product.
 * @param {Function} getState The redux getState function.
 * @returns {Object}
 */
function createOrder(formValues: { [string]: string }, product: any, getState: () => any) {
  const state = getState();

  const userAgent = getUserAgent();
  const platform = 'engage';
  const os = getPlatform(state);
  const externalCustomerNumber = getExternalCustomerNumberForOrder(state);

  // If no individual product was submitted, we handle the cart.
  if (product === null) {
    const grandTotal = getGrandTotal(state);
    return {
      localeCode: i18n.getLang().toLowerCase(),
      currencyCode: getCurrency(state),
      addressSequences: createAddressSequence(formValues, getState),
      primaryBillToAddressSequenceIndex: 0,
      lineItems: createCartLineItems(getState),
      subTotal: getSubTotal(state) || grandTotal,
      total: grandTotal,
      externalCustomerNumber,
      userAgent,
      platform,
      os,
    };
  }

  return {
    localeCode: i18n.getLang().toLowerCase(),
    currencyCode: product.price.currency,
    addressSequences: createAddressSequence(formValues, getState),
    primaryBillToAddressSequenceIndex: 0,
    lineItems: createSingleProductItems(product, getState),
    subTotal: product.price.unitPrice,
    total: product.price.unitPrice,
    externalCustomerNumber,
    userAgent,
    platform,
    os,
  };
}

export default createOrder;
