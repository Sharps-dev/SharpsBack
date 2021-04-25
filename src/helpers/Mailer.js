const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const config = require("../../config");
const eventEmmiter = require("./eventEmitter");

class MailConfig {
    constructor(subject, content, linkGenerator) {
        this.mailConfig = {
            from: {
                name: config.appName,
                address: config.mailUser
            },
            subject,
            template: 'main',
            context: {
                appName: config.appName,
                ...content
            }
        }
        if (typeof linkGenerator === "function")
            this.generateLink = linkGenerator;

        this.getConfig = this.getConfig.bind(this);
    }
    getConfig(user) {
        this.mailConfig.to = user.email;
        this.mailConfig.context.user = user.toJSON();
        if (this.generateLink)
            this.mailConfig.context.link = this.generateLink(user);
        return this.mailConfig;
    }
}

const mailConfigs = {
    signUp:
        new MailConfig(
            'Verify Account',
            {
                header: 'Welcome!',
                imgSrc: 'https://img.icons8.com/clouds/100/000000/handshake.png',
                text: 'Welcome to ' + config.appName + '.Please verify your account.',
                buttonText: 'Verify Account'
            },
            function (user) { return config.url + 'user/verify?t=' + user.generateToken({ saveToken: false }); }
        ),
    passwordReset:
        new MailConfig(
            'Reset Password',
            {
                header: 'Reset Password',
                imgSrc: 'https://img.icons8.com/clouds/100/000000/password.png',
                text: 'If you did not request to change your password, you can ignore this email and your password will not be changed.\
                      <br />This link will expire in 5 minutes',
                buttonText: 'Reset Password'
            },
            function (user) { return /*config.url + 'user/resetpassword?t='*/'http://localhost:3000/reset/reset_password?t=' + user.generateToken({ saveToken: false, expiresIn: '5m' }); }
        )
};

class Mailer {
    constructor(transportOptions) {

        this.transporter = nodemailer.createTransport(transportOptions);
        this.transporter.use('compile', hbs({
            viewEngine: {
                extname: '.hbs',
                layoutsDir: __dirname + '/views/',
                defaultLayout: 'layout',
                partialsDir: __dirname + '/views/'
            },
            viewPath: __dirname + '/views/',
            extName: '.hbs'
        }));
        this.attachListeners();

        this.sendMail = this.sendMail.bind(this);
        this.attachListeners = this.attachListeners.bind(this);
    }
    async sendMail(configName, user) {

        const mailConfig =
            mailConfigs[configName]
                .getConfig(user);

        await this.transporter.sendMail(mailConfig);
    }
    attachListeners() {
        for (const configName in mailConfigs) {
            eventEmmiter.on(configName, async (newUser) => {
                await this.sendMail(configName, newUser);
            });
        }
    }
}

module.exports = new Mailer({
    service: "gmail",
    auth: {
        user: config.mailUser,
        pass: config.mailPass
    }
});