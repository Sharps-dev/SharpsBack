// const User = require("../src/models/User");
const chai = require("chai");
const app = require("../config/testApp");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const expect = chai.expect;
const Content = require("../src/models/Content");

const wrongInput = [{ image: "1233121", longUrl: "123", des: "1233121", title: "hii" }];
const correctInput = [{ image: "1233121", longUrl: "https://github.com/ogt/valid-url#readme", des: "1233121", title: "hii" }];

describe("Content Tests 📧 ", () => {
  before(async function () {
    await Content.deleteMany();
  });
  it("inst wrong input 💢", async function () {
    const res = await request.post("/content/many").send(wrongInput);
    expect(res.status).equal(400);
  });

  it("inst correct input 👌 ", async function () {
    const res = await request.post("/content/many").send(correctInput);
    expect(res.status).equal(201);
  });
});
