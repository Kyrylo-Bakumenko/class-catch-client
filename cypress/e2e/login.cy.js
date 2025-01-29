// cypress/e2e/login.cy.js

describe("Login Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Displays Home Page Hero Heading", () => {
    cy.get("[data-test='hero-heading']").should("exist").contains("ClassCatch");
  });

  it("Navigates to the Login Page", () => {
    // Click the login link on the homepage
    cy.get("[data-test='login-link']").should("exist").click();

    // Confirm we landed on the login page
    cy.url().should("include", "/login");

    // The page should have a "Login" heading
    cy.get("h1").should("contain", "Login");
  });

  it("Logs in with valid credentials and redirects to Profile", () => {
    // 1) Click the login link
    cy.get("[data-test='login-link']").click();
    cy.url().should("include", "/login");

    // 2) Fill out username and password
    // Adjust these credentials to match a known user in your DB/test environment
    cy.get("input[type='text']").type("test");
    cy.get("input[type='password']").type("1234");

    // 3) Click the "Log In" button
    cy.get("button").contains("Log In").click();

    // 4) Confirm we land on /profile
    cy.url().should("include", "/profile");

    // Check that some content from profile page is visible
    // For instance, "Your Subscriptions"
    cy.contains("Your Subscriptions").should("be.visible");

    // ensure we see "You have no subscriptions yet." if none exist
    // cy.contains("You have no subscriptions yet.").should("be.visible");
  });
});
