const express = require("express");
const cors = require("cors");
app.use(express.json)
app.use(cors());
const mainRoute = require("./routes/index");
const app = express();


app.use("/api/v1", mainRoute);
app.listen(3000);



