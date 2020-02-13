describe('Login page', function () {
    it('Login as Expert', function () {
        cy.server()
        cy.route('GET', '/*').as('all')
        cy.route('DELETE', '/offerings/files/*').as('delete')

        cy.visit('http://localhost:3000/')

        cy.get('#login-from')

        cy.get('#register-expert-input').click()

        cy.get("#username-input").type('expert');
        cy.get("#email-input").type('expert@mail.com');
        cy.get("#password-input").type('expert123');
        cy.get("#password-confirmation-input").type('expert123');

        cy.get("#submit-register-input").click();

        cy.get('#bp3-tab-title_navbar_Offerings').click()
        cy.get('#offering-create-button').click()

        cy.get('#offering-title-input').type('Travel to Mount Everest')
        cy.get('#offering-description-input').type('# A fun travel to the Mount everest')

        cy.fixture('img1.jpg').then(fileContent => {
            cy.get('#photos-input').upload({ fileContent, fileName: 'img1.jpg', mimeType: 'image/*' });
        });
        cy.wait(500)
        cy.fixture('img2.jpg').then(fileContent => {
            cy.get('#photos-input').upload({ fileContent, fileName: 'img2.jpg', mimeType: 'image/*' });
        });
        cy.wait(500)
        cy.fixture('img3.jpg').then(fileContent => {
            cy.get('#photos-input').upload({ fileContent, fileName: 'img3.jpg', mimeType: 'image/*' });
        });
        cy.wait(500)


        cy.get('.file-upload-progress').eq(2).find('span[icon=delete]').click()
        cy.wait('@delete').its('status').should('eq', 200)

        cy.get('button[type=submit]').click()

        cy.get('.bp3-toast.bp3-intent-success')

        cy.get('.offering-card').first().find('h2').contains('Travel to Mount Everest')


    })

})