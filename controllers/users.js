import * as fs from "node:fs/promises";
import path from "path";
import User from "../models/users.js";

async function changeAvatar(req, res, next) {
  try {
    await fs.rename(
      req.file.path,
      path.resolve("public", "avatars", req.file.filename)
    );
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: req.file.filename,
      },
      { new: true }
    );
    res
      .send(user)
      .status(201)
      .send({ avatarURL: "тут буде посилання на зображення" });
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" });
  }
}

export default {
  changeAvatar,
};
