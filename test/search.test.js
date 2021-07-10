const chai = require("chai");
const app = require("../config/testApp");
const request = require("supertest")(app);
const expect = chai.expect;
const userModel = require('../src/models/User');
const contentModel = require('../src/models/Content');
const newToken = require("../src/utils/jwt/newToken");

const contents = [
    { image: "a", domain: "https://a.com", path: "/a", des: "a", title: "a", tags:["holu"] },
    { image: "b", domain: "https://b.com", path: "/b", des: "b", title: "b", tags:["moz", "goje"] },
    { image: "c", domain: "https://c.com", path: "/c", des: "c", title: "c", tags:["hendoone", "moz"] },
    { image: "d", domain: "https://d.com", path: "/d", des: "d", title: "d", tags:["goje"] }
];
const userInfo = { firstname: "John2", lastname: "Doe", email: "john2@doe.com", username: "john2d", password: "123456" };

describe('search tests 🔍', () => {

    let token;
    before(async () => {
        await contentModel.deleteMany();
        await contentModel.insertMany(contents);
        await userModel.deleteMany();
        const user = await userModel.create(userInfo);
        token = newToken(user);
        user.tokens.push(token);
        await user.save();

        contents.forEach(c => {
            c.url = c.domain + c.path;
            delete c.domain;
            delete c.path;
        });
    });

    it('searches on contents no filters', async function () {
        let res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: 'b' });
        expect(res.status).to.equal(200);
        expect(res.body.items[0]).to.deep.include(contents[1]);
        res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: '.com' });
        expect(res.status).to.equal(200);
        expect(res.body.items).to.have.lengthOf(4);
    });

    it('searches on content urls', async function () {
        let res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: 'b.c', url: 'true' });
        expect(res.status).to.equal(200);
        expect(res.body.items[0]).to.deep.include(contents[1]);
        res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: 'https://a.com', url: 'true' });
        expect(res.status).to.equal(200);
        expect(res.body.items[0]).to.deep.include(contents[0]);
    });

    it('searches on content titles', async function () {
        let res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: 'd', title: 'true' });
        expect(res.status).to.equal(200);
        expect(res.body.items[0]).to.deep.include(contents[3]);
        res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: 'abcd', title: 'true' });
        expect(res.status).to.equal(200);
        expect(res.body.items).to.be.empty;
    });

    it('searches on content tags', async function () {
        let res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: 'moz', tags: 'true' });
        expect(res.status).to.equal(200);
        expect(res.body.items.length).to.equal(2);
        res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: 'khiar', tags: 'true' });
        expect(res.status).to.equal(200);
        expect(res.body.items.length).to.equal(0);
        res = await request.get('/content/search').set({ Authorization: 'Bearer ' + token }).query({ s: 'holu', tags: 'true' });
        expect(res.status).to.equal(200);
        expect(res.body.items.length).to.equal(1);
        expect(res.body.items[0]).to.deep.include(contents[0]);
    });
});