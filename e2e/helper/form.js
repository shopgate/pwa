export function setValue(fieldSelector, value) {
  cy.get(fieldSelector)
    .should('be.visible')
    .clear()
    .type(value)
}

export function selectValue(selectSelector, value) {
  cy.get(selectSelector).select(value)
}
