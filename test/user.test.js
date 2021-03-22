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
  before(async function () {
    await User.deleteMany();
    console.log("before run user test ");
  });

  it("signUp user 🙂", async function () {
    const res = await request.post("/user/signup").send(signUpUser);
    expect(res.status).equal(200);
    expect(res.body.password).equal(undefined);
  });

  it("fail create user with duplicate email 💢 ", async function () {
    const res = await request.post("/user/signup").send(signUpUser);
    expect(res.status).equal(400);
  });

  it("fail create user with duplicate username 💢 ", async function () {
    const res = await request.post("/user/signup").send({ ...signUpUser, email: "johndoe3.test.com" });
    expect(res.status).equal(400);
  });

  it("login User with email 📧 ", async function () {
    await new User(initUser).save();
    const res = await request.post("/user/login").send({ email: initUser.email, password: initUser.password });
    const result = res.body;
    expect(res.status).equal(200);
    expect(result.token).to.not.equal(null);
  });

  it("login User with username ⤴ ", async function () {
    const res = await request.post("/user/login").send({ username: initUser.username, password: initUser.password });
    const result = res.body;
    expect(res.status).equal(200);
    expect(result.token).to.not.equal(null);
  });

  it("fail login with wrong email 💢", async function () {
    const res = await request.post("/user/login").send({ email: "john@tesss.com", password: initUser.password });
    const result = res.body;
    expect(res.status).equal(400);
  });
});
