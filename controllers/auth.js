import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Req = request body and res = response body
// async function for database relation with backend
export const register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      picturepath,
      firends,
      location,
      occupation,
    } = req.body;
    // from the frontend we need to send these parameters to the backend once it will be available

    const salt = await bcrypt.genSalt(); // Encrypting the password
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: passwordHash,
      picturepath,
      firends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save(); // saving the new user to the database
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
