const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config");

const signupScheme = zod.object({
    lastName: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/signup",async (res,req)=>{
    const body = req.body;
    const {success} = signupScheme(body);
    if(!success) {
        return res.status(411).json({
                message: "Email already taken/ Incorrect Inputs"
            })
    }

    const existingUser = await User.findOne({
        username: body.username,
    })

    if(existingUser) {
        return res.status(411).json({message: "Email already taken/ Incorrect Inputs"})
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id

    const token = jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        message:"User created successfully",
        token: token
    })
})

module.exports = router;
