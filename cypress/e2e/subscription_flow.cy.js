// cypress/e2e/subscription_flow.cy.js

describe("Subscription Flow", () => {
    beforeEach(() => {
      // If you need to reset data or ensure a user is logged out, do it here
      // For example, you might clear local storage or cookies:
      cy.clearCookies();
      cy.clearLocalStorage();
    });
  
    it("Logs in, subscribes to a class, and sees it in Profile", () => {
      // 1) Visit login page directly (or navigate from home)
      cy.visit("http://localhost:3000/login");
  
      // 2) Fill out login form
      cy.get('input[type="text"]').type("test");
      cy.get('input[type="password"]').type("1234");
  
      // 3) Submit login
      cy.get('button').contains("Log In").click();
  
      // 4) Confirm we're on /profile after login
      cy.url().should("include", "/profile");
      cy.contains("Your Subscriptions").should("be.visible");
  
    //   // Might see 'You have no subscriptions yet.' if none exist
    //   cy.contains("You have no subscriptions yet.").should("exist");
  
      // 5) Navigate to the classes page
      cy.visit("http://localhost:3000/classes");
  
      // 6) Locate the first class card and click subscribe
      // - You may need data-test attributes for reliability, e.g. data-test="class-card"
      // - Or use something like cy.contains("Subscribe") if it’s unique
      cy.get(".subscribe-button") // or a data-test="subscribe-button"
        .first()
        .click();
  
      // If your app shows an alert on success, confirm it
      // e.g., "Subscribed to Example Class successfully!"
      // We'll intercept the alert:
      cy.on("window:alert", (txt) => {
        expect(txt).to.match(/Subscribed to .+ successfully!/);
      });
  
      // 7) Go back to /profile to confirm the subscription
      cy.visit("http://localhost:3000/profile");
      cy.url().should("include", "/profile");
  
      // 8) Expect to see the newly subscribed class
      // If your class is named "Test Course" or something similar:
      cy.contains("Hist of Africa since 1800").should("be.visible");
    });
  });
  