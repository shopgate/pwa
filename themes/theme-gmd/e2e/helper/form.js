/**
 * Helper function that sets a Value
 * @param {string} fieldSelector fieldSelector
 * @param {string} value value
 */
export function setValue(fieldSelector, value) {
  cy.get(fieldSelector)
    .should('be.visible')
    .clear()
    .type(value);
}

/**
 * Helper function that sets a Value
 * @param {string} selectSelector selectSelector
 * @param {string} value value
 */
export function selectValue(selectSelector, value) {
  cy.get(selectSelector).select(value);
}
