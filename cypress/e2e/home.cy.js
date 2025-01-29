describe("Home Page", () => {
  it("Contains correct h1 text", () => {
    cy.visit("http://localhost:3000/");
    cy.get("[data-test='hero-heading']").should("exist").contains("ClassCatch");
  });
});
