const User = require("../src/models/User");
const chai = require("chai");
const app = require("../config/testApp");
const request = require("supertest")(app);
const expect = chai.expect;
// create simple user
const initUser = { firstname: "John", lastname: "Doe", email: "john@doe.com", username: "johnd", password: "123456" };
const signUpUser = { firstname: "John2", lastname: "Doe", email: "john2@doe.com", username: "john2d", password: "123456" };

// create new user ✔
describe("User tests", () => {
  // remove all DB data 🔥
  before(async () => {
    await User.deleteMany();
    console.log("before run user test ");
    await new User(initUser).save();
  });

  it("signUp user 🙂", async function () {
    const res = await request.post("/user/signup").send(signUpUser);
    expect(res.status).equal(200);
    expect(res.body.password).equal(undefined);
  });

  it("login User with email ", async function () {
    const res = await request.post("/user/login").send({ email: initUser.email, password: initUser.password });
    const result = res.body;
    expect(res.status).equal(200);
    expect(result.token).to.not.equal(null);
  });
});
