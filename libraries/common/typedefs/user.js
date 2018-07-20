/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} prefix
 * @property {string} firstName
 * @property {string} middleName
 * @property {string} lastName
 * @property {string} suffix
 * @property {string} mail
 * @property {string} gender male|female
 * @property {string} phone
 * @property {string} birthday YYYY-MM-DD
 * @property {UserGroup[]} userGroups
 * @property {UserAddress[]} addresses
 * @property {Object} customAttributes key value attributes
 */

/**
 * @typedef {Object} UserGroup
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} UserAddress
 * @property {string} id
 * @property {string} prefix
 * @property {string} firstName
 * @property {string} middleName
 * @property {string} lastName
 * @property {string} suffix
 * @property {string} phone
 * @property {string} company
 * @property {string} street1
 * @property {string} street2
 * @property {string} zipCode
 * @property {string} city
 * @property {string} province ISO code
 * @property {string} country ISO alpha-2 code
 * @property {string[]} tags default, shipping, billing, etc.
 * @property {Object} customAttributes key value attributes
 */
