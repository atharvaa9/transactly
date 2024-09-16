const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config");
const { authmiddleware } = require("../middleware")

const signupScheme = zod.object({
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/signup",async (res,req)=>{
    const body = req.body;
    const {success} = signupScheme.safeParse(body);
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

const signinScheme = zod.object({
    username: zod.string(),
    password: zod.string(),
})

router.post("/signin",async (res,req)=>{
    const body = req.body;
    const {success} = signupScheme.safeParse(body);
    if(!success) {
        return res.status(411).json({
                message: "Email already taken/ Incorrect Inputs"
            })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    if(user) {
        const token = jwt.sign({
            userId: user._id
        }.JWT_SECRET)

        res.json({
            token: token
        })
        return;
    }
    

    res.status(411).json({
        message:"Error while logging in",
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName:  zod.string().optional(),
    lastName:  zod.string().optional()
})

router.put("/",authmiddleware, async (req,res)=>{
    const body = req.body;
    const {success} = updateBody.safeParse(body);
    if(!success) {
        return res.status(411).json({
                message: "Error while updating information"
            })
    }

    await User.updateOne(req.body,{
        id:req.userId
    })

    res.json({
        message:"Updated successfully"
    })
})

router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or :[{
            firstName: {
                "$regex": filter
            }
        },{
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.localeCompare(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName:user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
