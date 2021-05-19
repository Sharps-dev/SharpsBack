const chai = require("chai");
const app = require("../config/testApp");
const request = require("supertest")(app);
const expect = chai.expect;
const userModel = require('../src/models/User');
const userHistoryModel = require('../src/models/UserHistory');
const eventTypes = userHistoryModel.schema.path('eventType').enumValues;
const contentModel = require('../src/models/Content');
const newToken = require("../src/utils/jwt/newToken");

const contentInfo = { image: "a", domain: "a.com", path: "/a", des: "a", title: "a" }
const userInfo = { firstname: "John", lastname: "Doe", email: "john@doe.com", username: "johndoe", password: "123456" };

describe('userHistory tests', () => {
    let url;
    let token;

    before(async () => {
        await userHistoryModel.deleteMany();
        await contentModel.deleteMany();
        url = (await contentModel.create(contentInfo)).url;

        await userModel.deleteMany();
        const user = await userModel.create(userInfo);
        token = newToken(user);
        user.tokens.push(token);
        await user.save();
    });

    it('creates multiple user histories', async function () {
        for (const eventType of eventTypes) {
            let res = await request.post('/userHistory').set({ Authorization: 'Bearer ' + token }).send({ url, eventType });
            expect(res.status).to.equal(201);
        };
        expect(await userHistoryModel.countDocuments()).to.equal(eventTypes.length - 2);//minus 2 cuz unlike deletes like
    });

    it("gets a user's latest histories", async () => {
        const res = await request.get('/userHistory').set({ Authorization: 'Bearer ' + token });
        expect(res.status).to.equal(200);
        const userHistories = res.body.userHistory;
        expect(userHistories.length).to.equal(eventTypes.length - 2);
        expect(userHistories[0].eventType).to.equal(eventTypes[eventTypes.length - 1]);//check descending order
    });
});