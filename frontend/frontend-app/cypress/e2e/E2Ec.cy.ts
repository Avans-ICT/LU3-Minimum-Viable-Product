/// <reference types="cypress" />
describe('End 2 End Test', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    cy.get("#email").type("123@123.nl")
    cy.get("#password").type("123123123")
    cy.contains("button", "Inloggen").click();
    cy.contains('a', 'Modules').click()
    cy.contains('button', 'Voeg toe aan favorieten').click()
    cy.contains('a', 'Favorieten').click()
    cy.contains('h5', 'Kennismaking met Psychologie').should('be.visible')
    cy.contains('button', 'Favoriet verwijderen').click()
    cy.contains('h5', 'Kennismaking met Psychologie').should('not.exist')
  })
});

it('Login', function() {});
