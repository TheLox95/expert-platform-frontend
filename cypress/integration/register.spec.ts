describe('Login page', function () {
    it('Login as Expert', function () {
        cy.server()
        cy.route('GET', '/*').as('all')

        cy.visit('http://localhost:3000/')

        cy.get('#login-from')

        cy.get('#register-expert-input').click()

        cy.get("#username-input").type('expert');
        cy.get("#email-input").type('expert@mail.com');
        cy.get("#password-input").type('expert123');
        cy.get("#password-confirmation-input").type('expert123');

        cy.get("#submit-register-input").click();

        cy.wait('@all').its('status').should('eq', 200)
        cy.wait('@all').its('status').should('eq', 200)

        cy.get('#dashboard-username').contains('Expert')
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

        cy.get('#login-from')

        cy.get('#register-client-input').click()

        cy.get("#username-input").type('client');
        cy.get("#email-input").type('client@mail.com');
        cy.get("#password-input").type('client123');
        cy.get("#password-confirmation-input").type('client123');

        cy.get("#submit-register-input").click();

        cy.wait('@all').its('status').should('eq', 200)
        cy.wait('@all').its('status').should('eq', 200)

        cy.get('#header-home')
        cy.get('#header-dashboard').should('not.exist');
        cy.get('#header-notifications')
        cy.get('#header-search')
        cy.get('#header-logout')
    })
})