/**
 * @typedef {Object} ProductCharacteristic
 * @property {string|number} id
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {Object} ProductTierPrice
 * @property {number|null} from
 * @property {number|null} to
 * @property {number} unitPrice
 */

/**
 * @typedef {Object} ProductPrice
 * @property {string} currency
 * @property {string} info
 * @property {number} unitPrice
 * @property {number} [unitPriceStriked]
 * @property {number} [unitPriceMin]
 * @property {number} [unitPriceMax]
 * @property {number} unitPriceNet
 * @property {number} unitPriceWithTax
 * @property {number} taxAmount
 * @property {number} taxPercent
 * @property {number} [msrp]
 * @property {ProductTierPrice[]} tiers
 * @property {number} [discount]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {ProductCharacteristic[]|null} [characteristics]
 * @property {ProductPrice|null} [price]
 */
