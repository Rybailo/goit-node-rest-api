import * as fs from "node:fs/promises";
import path from "path";
import User from "../models/users.js";
import Jimp from "jimp";

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

export default {
  changeAvatar,
};
