const chai = require("chai");
const app = require("../config/testApp");
const request = require("supertest")(app);
const expect = chai.expect;
const userModel = require('../src/models/User');
const contentModel = require('../src/models/Content');
const newToken = require("../src/utils/jwt/newToken");

const contents = [
    { image: "a", domain: "https://a.com", path: "/a", des: "a", title: "a" },
    { image: "b", domain: "https://b.com", path: "/b", des: "b", title: "b" },
    { image: "c", domain: "https://c.com", path: "/c", des: "c", title: "c" },
    { image: "d", domain: "https://d.com", path: "/d", des: "d", title: "d" }
];
const userInfo = { firstname: "John2", lastname: "Doe", email: "john2@doe.com", username: "john2d", password: "123456" };

describe('suggestion tests', () => {
    let userID;
    let suggesters;
    let suggestions;
    let user;

    before(async () => {
        await contentModel.deleteMany();
        const items = await contentModel.insertMany(contents);
        suggestions = [items[0]._id, items[1]._id];
        await userModel.deleteMany();
        userID = (await userModel.create(userInfo))._id;
        suggesters = [{ userID, suggestions }];
    });

    it('sets suggestions for users', async function() {
        const res = await request.put('/content/suggestions').send({ suggesters });
        expect(res.status).to.equal(200);
        user = await userModel.findById(userID);
        expect(user.suggestions).to.eql(suggestions);
    });

    it("gets a user's suggestions", async () => {
        const token = newToken(user);
        user.tokens.push(token);
        await user.save();
        const res = await request.get('/user/suggestions').set({ Authorization: 'Bearer ' + token });
        expect(res.status).to.equal(200);
        expect(res.body.total).to.equal(6);
    })
});