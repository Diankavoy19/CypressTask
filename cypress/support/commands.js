import 'cypress-file-upload';
Cypress.Commands.add('clickOutside', () => {
    cy.get('body').click(0, 0);
});