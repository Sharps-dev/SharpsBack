const UserController = require('./../src/controllers/UserController');

module.exports = (app) => {

    app.get("/test", (req, res) => {
        res.status(200).json("Hello world");
    });

    // USER ROUTES
    app.get(`/user`, UserController.getAll);
    app.post(`/user`, UserController.insert)
    app.put(`/user/:id`, UserController.update);
    app.delete(`/user/:id`, UserController.delete);

    
}