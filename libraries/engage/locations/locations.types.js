/**
 * @typedef {Object} LocationType
 * @property {string} code
 * @property {string} name
 */

/**
 * @typedef {Object} LocationOperationHours
 * @property {string|null} sun
 * @property {string|null} mon
 * @property {string|null} tue
 * @property {string|null} wed
 * @property {string|null} thu
 * @property {string|null} fri
 * @property {string|null} sat
 */

/**
 * @typedef {Object} LocationProductInventory
 * @property {boolean} isAvailable
 * @property {number|null} visible
 */

/**
 * @typedef {Object} LocationAddress
 * @property {string} code
 * @property {string} name
 * @property {string} street
 * @property {string|null} street2
 * @property {string|null} street3
 * @property {string|null} street4
 * @property {string} postalCode
 * @property {string} city
 * @property {string} region
 * @property {string} country
 * @property {string} [phoneNumber]
 * @property {string} [faxNumber]
 * @property {string} [emailAddress]
 * @property {boolean} isPrimary
 */

/**
 * @typedef {Object} Location
 * @property {string|null} code
 * @property {string|null} name
 * @property {string} [status]
 * @property {string[]} [supportedFulfillmentMethods]
 * @property {number} [latitude]
 * @property {number} [longitude]
 * @property {string} [timeZone]
 * @property {string} [localeCode]
 * @property {boolean} [isComingSoon]
 * @property {boolean} [isDefault]
 * @property {LocationType} [type]
 * @property {LocationOperationHours} [operationHours]
 * @property {LocationAddress} [address]
 * @property {LocationAddress[]} [addresses]
 * @property {LocationProductInventory} [productInventory]
 * @property {number} [distance]
 * @property {string} [unitSystem]
 * @property {Object} [inventory]
 */

/**
 * @typedef {Object} LocationAware
 * @property {Location} location
 * @property {string|null} [fulfillmentMethod]
 */

/**
 * @typedef {Object} OptionalLocationAware
 * @property {Location|null} [location]
 * @property {string|null} [fulfillmentMethod]
 */

/**
 * @typedef {Object} ProductLocations
 * @property {boolean} isFetching
 * @property {number} expires
 * @property {Location[]} locations
 */

/**
 * @typedef {Object<string, Location>} LocationsByIdState
 */

/**
 * @typedef {Object<string, ProductLocations>} LocationsByProductIdState
 */

/**
 * @typedef {Object} UserLocationState
 * @property {string|null} code
 * @property {string|null} name
 * @property {string|null} productCode
 * @property {number|null} visibleInventory
 * @property {string|null} addressCode
 * @property {string|null} fulfillmentMethod
 */

/**
 * @typedef {Object} ReservationFormValues
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [cellPhone]
 * @property {string} [email]
 * @property {string} [firstName2]
 * @property {string} [lastName2]
 * @property {string} [cellPhone2]
 * @property {string} [email2]
 */

/**
 * @typedef {Object<string, string|null>} UserFormInputState
 */

/**
 * @typedef {(
 *   typeof import('./constants').QUICK_RESERVE |
 *   typeof import('./constants').MULTI_LINE_RESERVE
 * )} FulfillmentPath
 */

/**
 * @callback SheetCallbackFn
 * @param {import('../../locations.types').Location | null} location
 * @param {string | null} productId
 * @param {boolean | null} orderSuccess
 * @returns {void}
 */

/**
 * @typedef {(typeof DIRECT_SHIP | typeof ROPIS| typeof BOPIS)} UserLocationFulfillmentMethod
 */

/**
 * @typedef {string | null} UserLocationLocationCode
 */

/**
 * @typedef {Object} LocationsState
 * @property {LocationsByIdState|{}} locationsById
 * @property {LocationsByProductIdState|{}} locationsByProductId
 * @property {UserLocationState|{}} userLocation
 * @property {ReservationFormValues} userFormInput
 * @property {string} userSearchQuery
 */

/**
 * @typedef {(
 *   typeof import('./constants').STAGE_SELECT_STORE |
 *   typeof import('./constants').STAGE_RESERVE_FORM |
 *   typeof import('./constants').STAGE_RESPONSE_SUCCESS |
 *   typeof import('./constants').STAGE_RESPONSE_ERROR
 * )} SheetStage
 */

/**
 * @typedef {Object} SheetOpenParams
 * @property {SheetCallbackFn} [callback]
 * @property {SheetStage} [stage]
 * @property {FulfillmentPath} [fulfillmentPath]
 * @property {boolean} [changeOnly]
 */

/**
 * @typedef {Object} ReservationResponse
 * @property {string[]|null} orderNumbers
 * @property {string[]|null} errors
 */
