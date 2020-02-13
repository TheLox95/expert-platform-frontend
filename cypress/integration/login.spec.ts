describe('Login page', function () {
    it('Login as Expert', function () {
        cy.server()
        cy.route('GET', '/*').as('all')

        cy.visit('http://localhost:3000/')

        cy.get("#user-input").type('nick');
        cy.get("#password-input").type('nick123');

        cy.get("#submit-input").click();

        cy.wait('@all').its('status').should('eq', 200)

        cy.get('#dashboard-username').contains('Nick')
        cy.get('#header-home')
        cy.get('#header-dashboard')
        cy.get('#header-notifications').should('not.exist');
        cy.get('#header-search')
        cy.get('#header-logout')
    })

    it('Login as Client', function () {
        cy.server()
        cy.route('GET', '/*').as('all')

        cy.visit('http://localhost:3000/')

        cy.get("#user-input").type('maria');
        cy.get("#password-input").type('maria123');

        cy.get("#submit-input").click();

        cy.wait('@all').its('status').should('eq', 200)

        cy.get('#header-home')
        cy.get('#header-dashboard').should('not.exist');
        cy.get('#header-notifications')
        cy.get('#header-search')
        cy.get('#header-logout')
    })
})