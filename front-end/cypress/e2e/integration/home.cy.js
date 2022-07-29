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
  it("should show a popup alert in case of link already registered", () => {
    const recommendation = {
      name: "Gilsons, Mariana Volker - Devagarinho",
      youtubeLink: "https://www.youtube.com/watch?v=NPl2N9eQOn4",
    };
    cy.visit("http://localhost:3000/");
    cy.get('input[placeholder="Name"]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(
      recommendation.youtubeLink
    );
    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "insertRecommendation"
    );
    cy.get("button").click();
    cy.wait("@insertRecommendation");
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Error creating recommendation!");
    });
  });
  it("should increase recommendation score", () => {
    cy.visit("http://localhost:3000/");
    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "0");
    });
    cy.get(`article:first`).within(() => {
      cy.get("svg:first").click();
    });
    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "1");
    });
  });
  it("should decrease recommendation score", () => {
    cy.visit("http://localhost:3000/");
    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "0");
    });
    cy.get(`article:first`).within(() => {
      cy.get("svg:last").click();
    });
    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "-1");
    });
  });
});
