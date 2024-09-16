const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes/index");

const app = express();

app.use(express.json)
app.use(cors());

app.use("/api/v1", rootRouter);
app.get('/', (req, res) => {
    res.json("Welcome! Connection started.");
  });
app.listen(3000, () => {
    console.log("Connection started on port 3000");
  });



