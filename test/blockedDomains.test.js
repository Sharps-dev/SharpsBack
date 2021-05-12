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

describe('blocked domains tests ⛔', () => {
    const domains = contents.map(c => c.domain);
    let token;
    let userId;

    before(async () => {
        await contentModel.deleteMany();
        await contentModel.insertMany(contents);

        await userModel.deleteMany();
        const user = await userModel.create(userInfo);
        token = newToken(user);
        user.tokens.push(token);
        await user.save();
        userId = user._id;
    });

    it('adds a domain to user blocked list', async function () {
        const blocked = [domains[0]];
        await request.post('/user/blockedDomains')
            .set({ Authorization: 'Bearer ' + token })
            .send({ domain: blocked[0] })
            .expect(200);

        const user = await userModel.findById(userId);
        expect(user.blockedDomains).to.eql(blocked);
    });

    it("sets user blocked domains", async () => {
        const blocked = [domains[0], domains[1]];
        await request.put('/user/blockedDomains')
            .set({ Authorization: 'Bearer ' + token })
            .send({ domains: blocked })
            .expect(200);

        const user = await userModel.findById(userId);
        expect(user.blockedDomains).to.eql(blocked);
    });

    it("gets user blocked domains", async () => {
        const blocked = [domains[0], domains[1]];
        const res = await request.get('/user/blockedDomains').set({ Authorization: 'Bearer ' + token });
        expect(res.status).to.equal(200);
        expect(res.body.blockedDomains).to.eql(blocked);
    });

    it("filters contents based on domains", async () => {
        const validUrls = [domains[2]+ contents[2].path, domains[3]+contents[3].path];
        const res = await request.get('/user/suggestions').set({ Authorization: 'Bearer ' + token }).query({ showAds: false });
        expect(res.status).to.equal(200);
        expect(res.body.total).to.equal(2);
        const resUrls = res.body.items.map(c => c.url);
        expect(resUrls).to.have.members(validUrls);
    });
});