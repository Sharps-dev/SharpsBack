const initiateApp = require('./config/app');
const { port } = require('./config');

initiateApp()
    .then(app => app.listen(port))
    .then(() => {
        console.clear();
        console.log(`app running on port ${port}`);
    })
