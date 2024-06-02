import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.create({ email, password: passwordHash });
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Помилка від Joi або іншої бібліотеки валідації" });
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).send({ message: "email or password is wrong" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "email or password is wrong" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });
    await User.findByIdAndUpdate(user._id, { token }, { new: true });
    const { subscription } = user;
    res.send({ token, user: { email, subscription } });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Помилка від Joi або іншої бібліотеки валідації" });
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
    res.status(204).end();
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" });
  }
}

async function current(req, res, next) {
  try {
    const { email, subscription } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
}

export default { register, login, logout, current };
