const express = require('express');

const app = express();
const port = 3000;

app.use(express.static('src'));

app.listen(port, function() {
	console.log(`Server is running on localhost:${port}`);
});
