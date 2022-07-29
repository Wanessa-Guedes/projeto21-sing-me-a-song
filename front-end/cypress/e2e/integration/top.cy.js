/// <reference types="cypress" />
import createData from "./factories/createDataFactory.js";

describe("top page tests e2e", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.insertDatabase();
  });
  it("should return top recommendations", () => {
    const recommendations = createData();
    cy.visit(`http://localhost:3000/`);
    cy.contains("Top").click();
    cy.url().should("equal", `http://localhost:3000/top`);
    cy.intercept("GET", "http://localhost:5000/recommendations/top/10").as(
      "getTopRecommendations"
    );
    cy.wait("@getTopRecommendations");
    cy.contains(recommendations[0].name);
  });
});
