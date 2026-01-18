/// <reference types="cypress" />

describe('End 2 End Test', () => {
  
  beforeEach(() => {
    // Login voor elke test
    cy.visit('http://localhost:5173/')
    cy.get("#email").type("123@123.nl")
    cy.get("#password").type("123123123")
    cy.contains("button", "Inloggen").click()
  })

  it('Gebruiker kan inloggen', () => {
    // Test wordt gedaan in beforeEach
    cy.url().should('not.include', '/login')
  })

  it('Gebruiker kan naar Modules pagina navigeren', () => {
    cy.contains('a', 'Modules').click()
    cy.url().should('include', '/allmodules')
  })

  it('Gebruiker kan module toevoegen aan favorieten', () => {
    cy.contains('a', 'Modules').click()
    cy.contains('button', 'Voeg toe aan favorieten').click()
    
    // Verifieer dat module is toegevoegd
    cy.contains('a', 'Favorieten').click()
    cy.contains('h5', 'Kennismaking met Psychologie').should('be.visible')
  })

  it('Gebruiker kan favorieten bekijken', () => {
    // Eerst favoriet toevoegen
    cy.contains('a', 'Modules').click()
    cy.contains('button', 'Voeg toe aan favorieten').click()
    
    // Dan favorieten pagina bezoeken
    cy.contains('a', 'Favorieten').click()
    cy.contains('h5', 'Kennismaking met Psychologie').should('be.visible')
  })

  it('Gebruiker kan favoriet verwijderen', () => {
    // Eerst favoriet toevoegen
    cy.contains('a', 'Modules').click()
    cy.contains('button', 'Voeg toe aan favorieten').click()
    
    // Naar favorieten en verwijderen
    cy.contains('a', 'Favorieten').click()
    cy.contains('h5', 'Kennismaking met Psychologie').should('be.visible')
    cy.contains('button', 'Favoriet verwijderen').click()
    cy.contains('h5', 'Kennismaking met Psychologie').should('not.exist')
  })

  it('Gebruiker kan suggesties pagina bekijken', () => {
    cy.contains('a', 'Suggesties').click()
    cy.get(':nth-child(1) > .card-body > .card-title').should('be.visible')
  })

  it('Gebruiker kan uitloggen via dropdown menu', () => {
    cy.get('#userDropdown').click()
    cy.get(':nth-child(3) > .dropdown-item').click()
    cy.url().should('include', '/login')
  })

})
