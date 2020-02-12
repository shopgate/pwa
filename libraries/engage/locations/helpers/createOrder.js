import { getProductDataById } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { makeGetUserLocation } from '../selectors';

/**
 * Creates the address sequence.
 * @param {Object} formValues The reserve form values.
 * @returns {Array}
 */
function createAddressSequence(formValues) {
  return [
    {
      type: 'billing',
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phone: formValues.cellPhone,
      emailAddress: formValues.email,
    },
    {
      type: 'pickup',
      firstName: formValues.firstName2,
      lastName: formValues.lastName2,
      phone: formValues.cellPhone2,
      emailAddress: formValues.email2,
    },
  ];
}

/**
 * Retrieves the featured image for a product. If the product doesn't have a featured image
 * and is a child product, the featured image of the base product is retrieved.
 * @param {Object} product The current product.
 * @param {FUnction} getState The redux getState function.
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
 * Creates the order line items.
 * @param {Object} product The current product.
 * @param {Object} location The selected user location.
 * @param {Function} getState The redux getState function.
 * @returns {Array}
 */
function createLineItems(product, location, getState) {
  return [
    {
      code: product.id,
      quantity: 1, // TODO: can be different from cart, once we implement reserve to cart.
      fulfillmentMethod: 'ROPIS', // TODO: Change based on the selected method.
      fulfillmentLocationCode: location.code,
      price: product.price.unitPrice,
      shipToAddressSequenceIndex: 0,
      currencyCode: product.price.currency,
      product: {
        code: product.id,
        name: product.name,
        image: getProductImage(product, getState),
        price: product.price.unitPrice,
        currencyCode: product.price.currency,
      },
    },
  ];
}

/**
 * Creates a fulfillment order out of the reserve form values and the current product.
 * @param {Object} formValues The reserve form values.
 * @param {Object} product The current product.
 * @param {Function} getState The redux getState function.
 * @returns {Object}
 */
function createOrder(formValues, product, getState) {
  const location = makeGetUserLocation()(getState());

  // create order
  const order = {
    // localeCode: process.env.LOCALE_FILE.replace('-', '_'),
    localeCode: 'de_DE',
    currencyCode: product.price.currency,
    addressSequences: createAddressSequence(formValues),
    primaryBillToAddressSequenceIndex: 0,
    lineItems: createLineItems(product, location, getState),
    subTotal: product.price.unitPrice,
    total: product.price.unitPrice,
  };

  return order;
}

export default createOrder;
