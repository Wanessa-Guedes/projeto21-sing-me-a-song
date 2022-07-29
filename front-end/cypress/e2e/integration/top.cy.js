/// <reference types="cypress" />
import createData from "./factories/createDataFactory.js";

describe("top page tests e2e", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.insertDatabase();
  });
  it("should return top recommendations", () => {
    const recommendations = createData();
    const amount = 3;
    cy.visit(`http://localhost:3000/`);
    cy.intercept("GET", "http://localhost:5000/recommendations/top/10").as(
      "getTopRecommendations"
    );
    cy.contains("Top").click();
    cy.url().should("equal", `http://localhost:3000/top`);
    cy.wait("@getTopRecommendations");
    cy.contains(recommendations[0].name);
    cy.get("article").should("have.length", amount);
  });
});
