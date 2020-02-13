// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
      */
      upload(data: { fileContent: any, fileName: string, mimeType: string, encoding?: string}): Chainable<Element>
    }
  }