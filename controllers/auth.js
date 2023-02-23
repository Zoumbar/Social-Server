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

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
