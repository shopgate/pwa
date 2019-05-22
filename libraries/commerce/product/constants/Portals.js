// FEATURES
const PRODUCT = 'product';

// CONTENTS
const IMAGE = 'image';
const MEDIA = 'media';
const HEADER = 'header';
const VARIANT_SELECT = 'variant-select';
const PICKER = 'picker';
const OPTIONS = 'options';
const DESCRIPTION = 'description';
const PROPERTIES = 'properties';
const REVIEWS = 'reviews';
const TAX_DISCLAIMER = 'tax-disclaimer';
const CTAS = 'ctas';
const FAVORITES = 'favorites';
const ADD_TO_CART = 'add-to-cart';
const RATING = 'rating';
const NAME = 'name';
const INFO = 'info';
const MANUFACTURER = 'manufacturer';
const SHIPPING = 'shipping';
const AVAILABILITY = 'availability';
const STOCK_INFO = 'stock-info';
const PRICE_STRIKED = 'price-striked';
const PRICE = 'price';
const PRICE_INFO = 'price-info';
const MAP_PRICE = 'map-price';
const TIERS = 'tiers';
const ADD_TO_CART_BAR = 'add-to-cart-bar';

// POSITIONS
const BEFORE = 'before';
const AFTER = 'after';
const ROW1 = 'row1';
const ROW2 = 'row2';

/* PRODUCT DETAILS */

// IMAGE
export const PRODUCT_IMAGE_BEFORE = `${PRODUCT}.${IMAGE}.${BEFORE}`;
export const PRODUCT_IMAGE = `${PRODUCT}.${IMAGE}`;
export const PRODUCT_IMAGE_AFTER = `${PRODUCT}.${IMAGE}.${AFTER}`;

// MEDIA
export const PRODUCT_MEDIA_BEFORE = `${PRODUCT}.${MEDIA}.${BEFORE}`;
export const PRODUCT_MEDIA = `${PRODUCT}.${MEDIA}`;
export const PRODUCT_MEDIA_AFTER = `${PRODUCT}.${MEDIA}.${AFTER}`;

// HEADER
export const PRODUCT_HEADER_BEFORE = `${PRODUCT}.${HEADER}.${BEFORE}`;
export const PRODUCT_HEADER = `${PRODUCT}.${HEADER}`;
export const PRODUCT_HEADER_AFTER = `${PRODUCT}.${HEADER}.${AFTER}`;

// CTAs
export const PRODUCT_CTAS_BEFORE = `${PRODUCT}.${CTAS}.${BEFORE}`;
export const PRODUCT_CTAS = `${PRODUCT}.${CTAS}`;
export const PRODUCT_CTAS_AFTER = `${PRODUCT}.${CTAS}.${AFTER}`;

export const PRODUCT_CTAS_FAVORITES_BEFORE = `${PRODUCT}.${CTAS}.${FAVORITES}.${BEFORE}`;
export const PRODUCT_CTAS_FAVORITES = `${PRODUCT}.${CTAS}.${FAVORITES}`;
export const PRODUCT_CTAS_FAVORITES_AFTER = `${PRODUCT}.${CTAS}.${FAVORITES}.${AFTER}`;

export const PRODUCT_CTAS_ADD_TO_CART_BEFORE = `${PRODUCT}.${CTAS}.${ADD_TO_CART}.${BEFORE}`;
export const PRODUCT_CTAS_ADD_TO_CART = `${PRODUCT}.${CTAS}.${ADD_TO_CART}`;
export const PRODUCT_CTAS_ADD_TO_CART_AFTER = `${PRODUCT}.${CTAS}.${ADD_TO_CART}.${AFTER}`;

// RATING
export const PRODUCT_RATING_BEFORE = `${PRODUCT}.${RATING}.${BEFORE}`;
export const PRODUCT_RATING = `${PRODUCT}.${RATING}`;
export const PRODUCT_RATING_AFTER = `${PRODUCT}.${RATING}.${AFTER}`;

// NAME
export const PRODUCT_NAME_BEFORE = `${PRODUCT}.${NAME}.${BEFORE}`;
export const PRODUCT_NAME = `${PRODUCT}.${NAME}`;
export const PRODUCT_NAME_AFTER = `${PRODUCT}.${NAME}.${AFTER}`;

// INFO
export const PRODUCT_INFO_BEFORE = `${PRODUCT}.${INFO}.${BEFORE}`;
export const PRODUCT_INFO = `${PRODUCT}.${INFO}`;
export const PRODUCT_INFO_ROW1 = `${PRODUCT}.${INFO}.${ROW1}`;
export const PRODUCT_INFO_ROW2 = `${PRODUCT}.${INFO}.${ROW2}`;
export const PRODUCT_INFO_AFTER = `${PRODUCT}.${INFO}.${AFTER}`;

// MANUFACTURER
export const PRODUCT_MANUFACTURER_BEFORE = `${PRODUCT}.${MANUFACTURER}.${BEFORE}`;
export const PRODUCT_MANUFACTURER = `${PRODUCT}.${MANUFACTURER}`;
export const PRODUCT_MANUFACTURER_AFTER = `${PRODUCT}.${MANUFACTURER}.${AFTER}`;

// SHIPPING
export const PRODUCT_SHIPPING_BEFORE = `${PRODUCT}.${SHIPPING}.${BEFORE}`;
export const PRODUCT_SHIPPING = `${PRODUCT}.${SHIPPING}`;
export const PRODUCT_SHIPPING_AFTER = `${PRODUCT}.${SHIPPING}.${AFTER}`;

// AVAILABILITY
export const PRODUCT_AVAILABILITY_BEFORE = `${PRODUCT}.${AVAILABILITY}.${BEFORE}`;
export const PRODUCT_AVAILABILITY = `${PRODUCT}.${AVAILABILITY}`;
export const PRODUCT_AVAILABILITY_AFTER = `${PRODUCT}.${AVAILABILITY}.${AFTER}`;

// STOCK INFO
export const PRODUCT_STOCK_INFO_BEFORE = `${PRODUCT}.${STOCK_INFO}.${BEFORE}`;
export const PRODUCT_STOCK_INFO = `${PRODUCT}.${STOCK_INFO}`;
export const PRODUCT_STOCK_INFO_AFTER = `${PRODUCT}.${STOCK_INFO}.${AFTER}`;

// PRICE STRIKED
export const PRODUCT_PRICE_STRIKED_BEFORE = `${PRODUCT}.${PRICE_STRIKED}.${BEFORE}`;
export const PRODUCT_PRICE_STRIKED = `${PRODUCT}.${PRICE_STRIKED}`;
export const PRODUCT_PRICE_STRIKED_AFTER = `${PRODUCT}.${PRICE_STRIKED}.${AFTER}`;

// PRICE
export const PRODUCT_PRICE_BEFORE = `${PRODUCT}.${PRICE}.${BEFORE}`;
export const PRODUCT_PRICE = `${PRODUCT}.${PRICE}`;
export const PRODUCT_PRICE_AFTER = `${PRODUCT}.${PRICE}.${AFTER}`;

// PRICE INFO
export const PRODUCT_PRICE_INFO_BEFORE = `${PRODUCT}.${PRICE_INFO}.${BEFORE}`;
export const PRODUCT_PRICE_INFO = `${PRODUCT}.${PRICE_INFO}`;
export const PRODUCT_PRICE_INFO_AFTER = `${PRODUCT}.${PRICE_INFO}.${AFTER}`;

// TIERS
export const PRODUCT_TIERS_BEFORE = `${PRODUCT}.${TIERS}.${BEFORE}`;
export const PRODUCT_TIERS = `${PRODUCT}.${TIERS}`;
export const PRODUCT_TIERS_AFTER = `${PRODUCT}.${TIERS}.${AFTER}`;

// VARIANT SELECT
export const PRODUCT_VARIANT_SELECT_BEFORE = `${PRODUCT}.${VARIANT_SELECT}.${BEFORE}`;
export const PRODUCT_VARIANT_SELECT = `${PRODUCT}.${VARIANT_SELECT}`;
export const PRODUCT_VARIANT_SELECT_AFTER = `${PRODUCT}.${VARIANT_SELECT}.${AFTER}`;

// VARIANT SELECT PICKER AVAILABILITY
export const PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_BEFORE = `${PRODUCT}.${VARIANT_SELECT}.${PICKER}.${AVAILABILITY}.${BEFORE}`;
export const PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY = `${PRODUCT}.${VARIANT_SELECT}.${PICKER}.${AVAILABILITY}`;
export const PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_AFTER = `${PRODUCT}.${VARIANT_SELECT}.${PICKER}.${AVAILABILITY}.${AFTER}`;

// OPTIONS
export const PRODUCT_OPTIONS_BEFORE = `${PRODUCT}.${OPTIONS}.${BEFORE}`;
export const PRODUCT_OPTIONS = `${PRODUCT}.${OPTIONS}`;
export const PRODUCT_OPTIONS_AFTER = `${PRODUCT}.${OPTIONS}.${AFTER}`;

// DESCRIPTION
export const PRODUCT_DESCRIPTION_BEFORE = `${PRODUCT}.${DESCRIPTION}.${BEFORE}`;
export const PRODUCT_DESCRIPTION = `${PRODUCT}.${DESCRIPTION}`;
export const PRODUCT_DESCRIPTION_AFTER = `${PRODUCT}.${DESCRIPTION}.${AFTER}`;

// PROPERTIES
export const PRODUCT_PROPERTIES_BEFORE = `${PRODUCT}.${PROPERTIES}.${BEFORE}`;
export const PRODUCT_PROPERTIES = `${PRODUCT}.${PROPERTIES}`;
export const PRODUCT_PROPERTIES_AFTER = `${PRODUCT}.${PROPERTIES}.${AFTER}`;

// REVIEWS
export const PRODUCT_REVIEWS_BEFORE = `${PRODUCT}.${REVIEWS}.${BEFORE}`;
export const PRODUCT_REVIEWS = `${PRODUCT}.${REVIEWS}`;
export const PRODUCT_REVIEWS_AFTER = `${PRODUCT}.${REVIEWS}.${AFTER}`;

// TAX DISCLAIMER
export const PRODUCT_TAX_DISCLAIMER_BEFORE = `${PRODUCT}.${TAX_DISCLAIMER}.${BEFORE}`;
export const PRODUCT_TAX_DISCLAIMER = `${PRODUCT}.${TAX_DISCLAIMER}`;
export const PRODUCT_TAX_DISCLAIMER_AFTER = `${PRODUCT}.${TAX_DISCLAIMER}.${AFTER}`;

// ADD TO CART BAR
export const PRODUCT_ADD_TO_CART_BAR_BEFORE = `${PRODUCT}.${ADD_TO_CART_BAR}.${BEFORE}`;
export const PRODUCT_ADD_TO_CART_BAR = `${PRODUCT}.${ADD_TO_CART_BAR}`;
export const PRODUCT_ADD_TO_CART_BAR_AFTER = `${PRODUCT}.${ADD_TO_CART_BAR}.${AFTER}`;

// MAP PRICE
export const PRODUCT_MAP_PRICE_BEFORE = `${PRODUCT}.${MAP_PRICE}.${BEFORE}`;
export const PRODUCT_MAP_PRICE = `${PRODUCT}.${MAP_PRICE}`;
export const PRODUCT_MAP_PRICE_AFTER = `${PRODUCT}.${MAP_PRICE}.${AFTER}`;

