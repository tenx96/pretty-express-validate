import "reflect-metadata";
import { combineControllers } from "pretty-express";
import SampleController from "./controller/sample.controller";
import request from "supertest";
import { expect } from "chai";
import { generateSampleApp } from "../demoApp";
import { registerValidationErrorHandler } from "../../";
//

describe("Nested validation tests", () => {
  let app = generateSampleApp();
  before(() => {
    const router = combineControllers([new SampleController()]);
    app.use(router);
    app.use(registerValidationErrorHandler());
  });

  after(() => {
    app = undefined;
  });
  it("Validate with no `required` nested data should fail", async () => {
    const response = await request(app)
      .post("/test/2")
      .set("Accept", "application/json")
      .send({
        prop1: "data1",
      })
      .expect("Content-Type", /json/)
      .expect(400);
  });


  it("Validate without `required` nested data should fail", async () => {
    const response = await request(app)
      .post("/test/2")
      .set("Accept", "application/json")
      .send({
        prop1: "data1",

      })
      .expect("Content-Type", /json/)
      .expect(400);
  });

  it("Validate with `required` nested data should pass", async () => {
    const response = await request(app)
      .post("/test/2")
      .set("Accept", "application/json")
      .send({
        prop1: "data1",
        nested : {
            name : "myname"
        }
        
      })
      .expect("Content-Type", /json/)
      .expect(200);
  });


  it("Validate with `required` nested data but invalid should fail", async () => {
    const response = await request(app)
      .post("/test/2")
      .set("Accept", "application/json")
      .send({
        prop1: "data1",
        nested : {
            name : 123
        }
        
      })
      .expect("Content-Type", /json/)
      .expect(400);
  });
});
