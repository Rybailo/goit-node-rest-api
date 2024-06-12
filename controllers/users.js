import * as fs from "node:fs/promises";
import path from "path";
import User from "../models/users.js";
import Jimp from "jimp";
import mail from "../mail.js";

async function changeAvatar(req, res, next) {
  try {
    const avatarPath = req.file.path;
    const avatarFilename = req.file.filename;
    const avatarDestination = path.resolve("public", "avatars", avatarFilename);
    const img = await Jimp.read(avatarPath);
    await img.resize(250, 250).writeAsync(avatarPath);
    await fs.rename(avatarPath, avatarDestination);

    const avatarURL = `/avatars/${avatarFilename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: avatarFilename,
        avatarURL,
      },
      { new: true }
    );

    res.status(200).send({ user });
  } catch (error) {
    console.error("Ошибка при обработке аватарки:", error);
    return res.status(401).send({ message: "Not authorized" });
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    await User.findByIdAndUpdate(
      user._id,
      { verify: true, verificationToken: null },
      { new: true }
    );
    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "missing required field email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    let verificationToken = user.verificationToken;
    if (!verificationToken) {
      verificationToken = crypto.randomUUID();
      user.verificationToken = verificationToken;
      await user.save();
    }

    mail.sendMail({
      to: email,
      from: "rybailo.orest@gmail.com",
      subject: email,
      html: `To confirm your email, please click <a href="http://localhost:3000/api/users/verify/${verificationToken}">here</a>`,
      text: `To confirm your email, please click here: http://localhost:3000/api/users/verify/${verificationToken} `,
    });

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({ message: "Помилка від Joi або іншої бібліотеки валідації" });
  }
}
export default {
  changeAvatar,
  verifyEmail,
  resendVerificationEmail,
};
