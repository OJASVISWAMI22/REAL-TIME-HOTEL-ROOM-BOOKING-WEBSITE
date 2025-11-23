const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt=require("bcryptjs");
const rateLimit=require("express-rate-limit");
const validator=require("validator");


const login_limiter=rateLimit({
  windowMs:15*60*1000, // 15 minutes
  max:5,
  message:"Too many login attempts, please try again after 15 minutes"
})

const validate_email = (email) => {
  if (!validator.isEmail(email)) {
    return false;
  }
  const domain = email.toLowerCase().split('@')[1];
  
  const disposableDomains = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email', 'trashmail.com'
  ];
  
  if (disposableDomains.includes(domain)) {
    return false;
  }

  if (/^(test|asdf|qwer|admin|user)\d*@/.test(email.toLowerCase())) {
    return false;
  }
  return true;
};

const validate_password=(password)=>{
  return  password && password.length>=8;
}

const sanitize_input = (str) => {
  if (typeof str !== "string") return "";
  return str.trim();
};

const sanitize_name=(str)=>{
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
}


router.post("/register", async (req, res) => {
  try {
    const email=sanitize_input(req.body.email);
  const password=sanitize_input(req.body.password);
  const name=sanitize_name(req.body.name);
  const cp=sanitize_input(req.body.cp);

  if(!email || !password ||!name ||!cp){
    return res.status(400).json({ message: "All fields are required" });
  }

  if(!validate_email(email)){
    return res.status(400).json({ message: "Invalid email" });
  }

  if(password!==cp){
    return res.status(400).json({message:"Password don't match"});
  }

  if(!validate_password(password)){
    return res.status(400).json({message:"Password must be at least 8 characters long"});
  }

   const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    }).lean();

    if (existingUser) {
      return res.status(400).json({ 
        message: "Registration failed.Email already linked to another account" 
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser=new User({
      name,
      email:email.toLowerCase(),
      password:hashedPassword,
    })

    const user = await newuser.save();
    res.status(201).json({message:"User registered successfully"});
  } catch (error) {
    return res.status(400).json({message:"Registration failed. Please try again."});
  }
});


router.post("/login", login_limiter,async (req, res) => {
  try {
    const email = sanitize_input(req.body.email);
    const password = sanitize_input(req.body.password);

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    if (!validate_email(email)) {
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }


    const user = await User.findOne({ 
      email: email.toLowerCase()
    });

    const dummyHash = '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEF';
    const hashToCompare = user ? user.password : dummyHash;
    const is_password_valid = await bcrypt.compare(password, hashToCompare);

    if (!user || !is_password_valid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }


    const userData = {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      _id: user._id,
    };

    res.json(userData);

  } catch (error) {
    return res.status(500).json({ 
      message: "Login failed. Please try again." 
    });
  }
});

module.exports = router;
