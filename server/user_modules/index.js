// When any of the routes in this module are accessed, we can safely assume that the user is authenticated.
let express = require('express');
let app = express.Router();

// Obtains user info
app.get('/info', (req, res) => {

})

module.exports = app;