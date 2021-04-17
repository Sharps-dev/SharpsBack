const Controller = require("./Controller");
const UserService = require("./../services/UserService");
const User = require("./../models/User");
const { AppError } = require("../helpers/AppError");
const eventEmmiter = require("../helpers/eventEmitter");
const checkToken = require("../utils/jwt/checkToken");

const userService = new UserService(User);

class UserController extends Controller {
  constructor(service) {
    super(service);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.getUser = this.getUser.bind(this);
    this.update = this.update.bind(this);
    this.logout = this.logout.bind(this);
    this.logoutAll = this.logoutAll.bind(this);
    this.verifyAccount = this.verifyAccount.bind(this);
    this.requestResetPassword = this.requestResetPassword.bind(this);
    this.serveResetPasswordPage = this.serveResetPasswordPage.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }
  /**
   *
   * @param {String} req
   * @param {String} res
   * @returns {Json} res
   */
  async login(req, res, next) {
    try {
      const { password, email, username } = req.body;
      if (!password || (!email && !username)) throw new AppError("عبارات وارد شده صحیح نیستند", 400);

      const response = await this.service.login(req.body);
      return res.status(200).send(response).end();
    } catch (err) {
      next(err);
    }
  }

  async signUp(req, res, next) {
    try {
      const { password, username, email } = req.body;
      if (!password || !email || !username) throw new AppError("لطفا موارد الزامی را وارد نمایید", 400);
      const newUser = await this.service.insert(req.body);
      eventEmmiter.emit("signUp", newUser);
      return res
        .status(201)
        .json({
          user: newUser,
          token: newUser.generateToken(),
        })
        .end();
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const { user } = req;
      return res.status(200).json(user).end();
    } catch (error) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const validUpdate = ["firstname", "lastname", "password", "avatar"];
      const { body } = req;
      if (Object.keys(body).length == 0) next(new AppError("enter some valid thing", 400));
      const validObject = {};
      validUpdate.forEach((v) => {
        if (body[v]) validObject[v] = body[v];
      });
      if (Object.keys(validObject).length == 0) throw new AppError("enter some valid thing", 400);
      const { user } = req;
      const result = await this.service.update(user._id, validObject);
      if (!result) throw new AppError("somthing wrong", 400);
      else return res.status(204).json({ message: "updated successfully " }).end();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const result = await this.service.logout(req);
      return res.status(200).json(result).end();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
  async logoutAll(req, res, next) {
    try {
      const { user } = req;
      const result = await this.service.logoutAll(user);
      return res.status(200).json(result).end();
    } catch (e) {
      console.error(e);
      next(e);
    }
  }

  async verifyAccount(req, res, next) {
    try {
      const { _id } = await checkToken(req.query.t);
      const user = await this.service.getOne({ _id });
      if (!user) throw new AppError("invalid link", 404);

      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
      return res
        .status(200)
        .json("Your account (" + user.email + ") is successfully verified.")
        .end();
    } catch (err) {
      next(err);
    }
  }
  async requestResetPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await this.service.getOne({ email });
      if (user && user.isVerified) eventEmmiter.emit("passwordReset", user);

      return res.status(200).json("If the email you specified exists in our system and is verified, we've sent a password reset link to it.").end;
    } catch (err) {
      next(err);
    }
  }
  async serveResetPasswordPage(req, res, next) {
    try {
      const { _id } = await checkToken(req.query.t);
      const user = await this.service.getOne({ _id });
      if (!user) throw new AppError("invalid link", 404);

      //temporary
      const html = `
            <html>
            <head>
                <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
                <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
                <script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
            </head>
             <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
             <div class="form-gap"></div>
            <div class="container">
	            <div class="row">
		            <div class="col-md-4 col-md-offset-4">
                        <div class="panel panel-default">
                          <div class="panel-body">
                            <div class="text-center">
                              <h3><i class="fa fa-lock fa-4x"></i></h3>
                              <h2 class="text-center">Forgot Password?</h2>
                              <p>You can reset your password here.</p>
                              <div class="panel-body">
                                <form id="register-form" role="form" autocomplete="off" class="form" method="post" action="/user/password">
                                  <div class="form-group">
                                    <div class="input-group">
                                      <span class="input-group-addon"><i class="glyphicon glyphicon-envelope color-blue"></i></span>
                                      <input id="password" name="password" placeholder="Password" class="form-control"  type="password">
                                    </div>
                                    <div class="input-group">
                                      <span class="input-group-addon"><i class="glyphicon glyphicon-envelope color-blue"></i></span>
                                      <input id="retryPassword" name="retryPassword" placeholder="Re enter password" class="form-control"  type="password">
                                    </div>
                                  </div>
                                  <div class="form-group">
                                    <input class="btn btn-lg btn-primary btn-block" value="Reset Password" type="submit">
                                  </div>
                                  <input type="hidden" class="hide" name="token" id="token" value="${req.query.t}"> 
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
	            </div>
            </div>
            </html>
        `;

      return res.send(html).end();
    } catch {
      next(new AppError("link expired", 404));
    }
  }
  async updatePassword(req, res, next) {
    try {
      const { password, retryPassword, token } = req.body;
      if (!token) throw new AppError("Unauthorized", 401);
      if (!password || !retryPassword) throw new AppError("Fill in the required fields", 400);
      if (password !== retryPassword) throw new AppError("Passwords do not match", 400);

      const { _id } = await checkToken(token);
      const user = await this.service.getOne({ _id });
      if (!user) throw new AppError("Unauthorized", 401);

      user.password = password;
      await user.save();
      return res.status(200).json("Password is reset successfully.").end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController(userService);
