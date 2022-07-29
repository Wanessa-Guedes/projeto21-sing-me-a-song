/// <reference types="cypress" />
describe("random pages tests e2e", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.insertDatabase();
  });
  it("should return random recommendations with score greater or equal -5", () => {
    cy.visit(`http://localhost:3000/`);
    cy.intercept("GET", "http://localhost:5000/recommendations/random").as(
      "getRandomRecommendations"
    );
    cy.contains("Random").click();
    cy.url().should("equal", `http://localhost:3000/random`);
    cy.wait("@getRandomRecommendations");
    cy.get(`article`).within(() => {
      cy.get("div:first").should(($div) => {
        const text = $div.text();
        expect(text).to.be.oneOf([
          "Gilsons - Várias Queixas",
          "Gilsons - Pra Gente Acordar",
          "Gilsons, Mariana Volker - Devagarinho",
        ]);
      });
    });
    cy.get("article").should("have.length", 1);
  });
});
