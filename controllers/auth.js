import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import mail from "../mail.js";
import crypto from "crypto";

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();
    const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "mm" });
    const result = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });
    mail.sendMail({
      to: email,
      from: "rybailo.orest@gmail.com",
      subject: "Welcome to ...",
      html: `To confirm your email, please click <a href="http://localhost:3000/api/users/verify/${verificationToken}">here</a>`,
      text: `To confirm your email, please click here: http://localhost:3000/api/users/verify/${verificationToken} `,
    });
    if (!validateEmail(email)) {
      throw new Error("Invalid email address");
    }
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
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
    if (user.verify === false) {
      return res.status(404).send({ message: "User not found" });
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
