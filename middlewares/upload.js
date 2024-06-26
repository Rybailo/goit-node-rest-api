import multer from "multer";
import path from "node:path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: function (req, file, cb) {
    console.log({ file });
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();
    const filename = `${basename}--${suffix}${extname}`;
    cb(null, filename);
  },
});

export default multer({ storage });
