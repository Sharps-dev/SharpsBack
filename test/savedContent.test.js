const chai = require("chai");
const app = require("../config/testApp");
const request = require("supertest")(app);
const expect = chai.expect;
const userModel = require('../src/models/User');
const contentModel = require('../src/models/Content');
const newToken = require("../src/utils/jwt/newToken");

const contents = [
    { image: "a", domain: "a.com", path: "/a", des: "a", title: "a" },
    { image: "b", domain: "b.com", path: "/b", des: "b", title: "b" },
    { image: "c", domain: "c.com", path: "/c", des: "c", title: "c" },
    { image: "d", domain: "d.com", path: "/d", des: "d", title: "d" }
];
const userInfo = { firstname: "John2", lastname: "Doe", email: "john2@doe.com", username: "john2d", password: "123456" };

describe('saved content tests', () => {
    let urls = [];
    let contentIds = [];
    let userId;
    let token;

    before(async () => {
        await contentModel.deleteMany();
        const dbContents = await contentModel.insertMany(contents);
        for (const content of dbContents) {
            urls.push(content.url);
            contentIds.push(content._id);
        }

        await userModel.deleteMany();
        const user = await userModel.create(userInfo);
        token = newToken(user);
        user.tokens.push(token);
        await user.save();
        userId = user._id;
    });

    it('saves content for user', async function () {
        const savedUrls = [urls[0], urls[1]];
        const savedIds = [contentIds[0], contentIds[1]];
        let res = await request.post('/user/savedContents').set({ Authorization: 'Bearer ' + token }).send({ url: savedUrls[0] });
        expect(res.status).to.equal(200);
        res = await request.post('/user/savedContents').set({ Authorization: 'Bearer ' + token }).send({ url: savedUrls[1] });
        expect(res.status).to.equal(200);
        
        const user = await userModel.findById(userId);
        expect(user.savedContents).to.eql(savedIds);
    });

    it("removes a saved content", async () => {
        const savedId = [contentIds[0]];
        const res = await request.delete('/user/savedContents').set({ Authorization: 'Bearer ' + token }).query({ url: urls[1]});
        expect(res.status).to.equal(200);

        const user = await userModel.findById(userId);
        expect(user.savedContents).to.eql(savedId);
    });

    it("gets user's saved contents", async () => {
        const savedUrl = [urls[0]];
        const res = await request.get('/user/savedContents').set({ Authorization: 'Bearer ' + token });
        expect(res.status).to.equal(200);
        expect(res.body.total).to.equal(1);
        expect(res.body.items[0].url).to.equal(savedUrl[0]);
    });
});