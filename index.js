require("babel-polyfill");
require("babel-register");
const app = require('./server');

app.listen(8080);
