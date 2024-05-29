import User from "../models/users.js";
import bcrypt from "bcrypt";

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.create({ email, password: passwordHash });
    console.log(result);
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
    res.send({ token: "TOKEN" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Помилка від Joi або іншої бібліотеки валідації" });
  }
}

export default { register, login };
