const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');
const config = require('../config');
mockery.enable({ warnOnUnregistered: false });
mockery.registerMock('nodemailer', nodemailerMock);

const app = require("../config/testApp");
const request = require("supertest")(app);
const expect = require("chai").expect;
const User = require("../src/models/User");

const user = {firstname: "John", lastname: "Doe", email: "John@Doe.com", username: "johndoe", password: "123456" };

describe("Mailer tests", async function() {

	before(async () => await User.deleteMany());

	it("sends verification email upon user signup", async function () {
		const res = await request.post("/user/signup").send(user);
		expect(res.status).equal(201);
		const sentMails = nodemailerMock.mock.getSentMail();
		expect(sentMails.length).to.equal(1);
		sentMail = sentMails[0];
		expect(sentMail.to).to.equal(user.email);
	});

	it("verifies an account", async function () {
		expect(sentMail.context.link).to.exist;
		const { link } = sentMail.context;
		const res = await request.get(link.replace(config.url,"/"));
		expect(res.status).equal(200);
		const signedUpUser = await User.findOne({ username: user.username });
		expect(signedUpUser.isVerified).to.be.true;
	});

	afterEach(async () => nodemailerMock.mock.reset());

	after(async function () {
		mockery.deregisterAll();
		mockery.disable();
	});
})