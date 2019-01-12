const express = require('express');

const app = express();

app.use(express.static('public'));

// start the server with the build folder.
app.use('/', express.static(__dirname + '/build'));

const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Server started at http://localhost:%s', server.address().port);
