import User from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Buffer } from "buffer";
import fs from "fs";

//Generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    let picturePath = req.body.picturePath;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      const msg = "Email address already exists";
      res.status(400).json(msg);
      console.log();
    }

    // If a file was uploaded, convert it to base64
    if (req.file) {
      const file = req.file;
      const fileContent = fs.readFileSync(file.path);
      picturePath = new Buffer.from(fileContent).toString("base64");
    } else {
      picturePath = "../Assets/Avatar.png";
    }

    //hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      role,
      password: hashedPassword,
      email,
      picturePath: picturePath,
    });

    //generate a token
    const token = generateToken(user._id);

    //send HTTP-only cookie
    res.cookie("token", token, {
      Path: "/",
      HttpOnly: true,
      Expires: new Date(Date.now() + 1000 * 86400), //1 day
      SameSite: "none",
      Secure: true,
    });

    //validation
    if (!req.body.firstName || !req.body.email || !req.body.password) {
      const msg = "Please fill in the required fields";
      res.status(400).json(msg);
      console.log(msg);
    }

    if (req.body.password.length < 6) {
      const msg = "The password must be at least 6 characters";
      res.status(400).json(msg);
      console.log(msg);
    }

    //Send back data
    res.status(201).json({
      user,
      token,
    });
    console.log(user, "User created successfully");
  } catch (error) {
    console.log(error, `error registering`);
  }
};

// login user also start using async-handler

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //validate request
  if (!email || !password) {
    const msg = "please enter add email and password";
    res.status(400).json(msg);
  }
  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    const msg = "User with that email not found , please register";
    res.status(400).json(msg);
  }
  // user exists, Check if the password is correct
  const passwordCorrect = await bcrypt.compare(password, user.password);

  //generate a token
  const token = generateToken(user._id);

  //send HTTP-only cookie
  res.cookie("token", token, {
    Path: "/",
    HttpOnly: true,
    Expires: new Date(Date.now() + 1000 * 86400), //1 day
    SameSite: "none",
    Secure: true,
  });

  if (user && passwordCorrect) {
    const user = req.body;
    res.status(200).json({
      user, // you may display all the fields too
      token,
    });
  } else {
    res.status(400);
    throw new Error("password or email incorrect");
  }
};

//logoutUser
export const logoutUser = async (req, res) => {
  // you can either delete the cookie or expire the cookie, I will do exipirection

  //send HTTP-only cookie
  res.cookie("token", "", {
    Path: "/",
    HttpOnly: true,
    Expires: new Date(0), //current second
    SameSite: "none",
    Secure: true,
  });
  return res.status(200).json({ msg: "Successfully logged out" });
};
//get/ fetch User
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};
