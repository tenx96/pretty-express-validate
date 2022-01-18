import "reflect-metadata"
import { combineControllers } from "pretty-express";
import SampleController from "./controller/sample.controller";
import request from "supertest";
import { expect } from "chai";
import {generateSampleApp} from "../demoApp"
import {registerValidationErrorHandler} from "../../"
//

describe("@validate tests", () => {
  let app = generateSampleApp();
  before(() => {
    const router = combineControllers([new SampleController()]);
    app.use(router);
    app.use(registerValidationErrorHandler())
  });

  after(() => {
    app = undefined;
  });
  it("Validate with proper data, should pass", async () => {
    const response = await request(app)
      .post("/test/1")
      .set("Accept", "application/json")
      .send({
          prop1 : "data1",
          prop2 : "data2"
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).to.have.keys("prop1" , "prop2");
    expect(response.body.prop1).to.be.equal("data1")
    expect(response.body.prop2).to.be.equal("data2")
  });

  it("Validate without optional data, should pass", async () => {
    const response = await request(app)
      .post("/test/1")
      .set("Accept", "application/json")
      .send({
          prop1 : "data1"
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).to.have.keys("prop1");
    expect(response.body.prop1).to.be.equal("data1")
  });

  it("Validate without required data, should return 400", async () => {
    const response = await request(app)
      .post("/test/1")
      .set("Accept", "application/json")
      .send({
          prop2 : "data1"
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).to.have.keys("message" , "error" );
  });

  it("Validate with required data, but invalid should return 400", async () => {
    const response = await request(app)
      .post("/test/1")
      .set("Accept", "application/json")
      .send({
          prop1 : 123,
          prop2 : "data1"
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).to.have.keys("message" , "error" );
  });


  it("Validate with required data, but extra data, should return 400", async () => {
    const response = await request(app)
      .post("/test/1")
      .set("Accept", "application/json")
      .send({
          prop1 : "data1",
          prop2 : "data2",
          extra : "extra1"
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).to.have.keys("message" , "error");
  });
 

 
  
  
});
