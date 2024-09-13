const express = require("express");
const userRoute = require("./user")
const router = express.Router();


router.use("/user",userRoute)
module.exports = router;
