/// <reference types="cypress" />

describe("insert recommendation", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.insertDatabase();
  });
  it("insert recommendation with success", () => {
    const recommendation = {
      name: "Maria Gadú - 'Dona Cila'",
      youtubeLink: "https://www.youtube.com/watch?v=nEjoPH2mLjw",
    };
    cy.visit("http://localhost:3000/");
    cy.get('input[placeholder="Name"').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."').type(
      recommendation.youtubeLink
    );
    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "insertRecommendation"
    );
    cy.get("button").click();
    cy.wait("@insertRecommendation");
  });
});
