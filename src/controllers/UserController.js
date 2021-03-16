const Controller =require('./Controller');
const UserService = require("./../services/UserService");
const User = require("./../models/User");

const userService = new UserService(User);

class UserController extends Controller {

    constructor(service) {
        super(service);
        this.signUp = this.signUp.bind(this);
    }

    async signUp(req, res, next) {
        try {
            const response = await this.service.insert(req.body);

            //TODO: refactor
            if (response.error)
                throw { code: 503, message: 'Signup failed' };

            const newUser = response.item;
            return res.json({
                user: newUser,
                token: newUser.generateToken()
            }).end();

        } catch (err) { next(err); }
    }
}

module.exports = new UserController(userService);