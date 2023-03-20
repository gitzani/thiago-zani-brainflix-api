const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const serverRoutes = require("./routes/videos");
const path = require("path");
const publicDirectory = path.join(__dirname, '..', 'public');
app.use(express.static(publicDirectory));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('dotenv').config();

const { PORT, BACKEND_URL, CLIENT_URL } = process.env;
console.log("port", PORT, "backURL",  BACKEND_URL, "clientURL", CLIENT_URL)
const port = process.env.PORT || process.argv[2] || 8080;

app.use(cors({origin: [CLIENT_URL, `${BACKEND_URL}:${PORT}`],}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(serverRoutes);


app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
