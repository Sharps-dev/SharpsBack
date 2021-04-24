const User = require("../src/models/User");
const chai = require("chai");
const app = require("../config/testApp");
const request = require("supertest")(app);
const newToken = require("../src/utils/jwt/newToken");
const mongoose = require("mongoose");
const expect = chai.expect;
// create simple user
const initIdUser = new mongoose.Types.ObjectId();
const initUser = { _id: initIdUser, firstname: "John", lastname: "Doe", email: "john@doe.com", username: "johnd", password: "123456" };
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
    signUpUser.tokens = [res.body.token];
    expect(res.status).equal(201);
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
    const createUser = await new User(initUser).save();
    const res = await request.post("/user/login").send({ email: initUser.email, password: initUser.password });
    const result = res.body;
    initUser.tokens = createUser.tokens;
    expect(res.status).equal(200);
    expect(result.token).to.not.equal(null);
  });

  it("fail login with wrong email 💢", async function () {
    const res = await request.post("/user/login").send({ email: "john@tesss.com", password: initUser.password });
    expect(res.status).equal(400);
  });
  it("login User with username ⤴ ", async function () {
    const res = await request.post("/user/login").send({ username: initUser.username, password: initUser.password });
    const result = res.body;
    expect(res.status).equal(200);
    expect(result.token).to.not.equal(null);
  });

  it("get user info 😇 ", async function () {
    const findUser = await User.findById(initIdUser);
    const res = await request.get("/user/").set({ "Content-Type": "application/json", Authorization: `Bearer ${findUser.tokens[0]}` });
    expect(res.status).equal(200);
  });

  it("user update info 📈  ", async function () {
    const findUser = await User.findById(initIdUser);
    const res = await request
      .put("/user/")
      .set({ "Content-Type": "application/json", Authorization: `Bearer ${findUser.tokens[0]}` })
      .send({ firstname: "John junior" });
    expect(res.status).equal(204);
  });

  it("user logout all devices 😠 ", async function () {
    const findUser = await User.findById(initIdUser);
    const res = await request.post("/user/logoutall").set({ "Content-Type": "application/json", Authorization: `Bearer ${findUser.tokens[0]}` });
    expect(res.status).equal(200);
  });

  it("user delete account 😢 ", async function () {
    const res = await request.delete("/user/").set({ "Content-Type": "application/json", Authorization: `Bearer ${signUpUser.tokens[0]}` });
    expect(res.status).equal(204);
  });
});
