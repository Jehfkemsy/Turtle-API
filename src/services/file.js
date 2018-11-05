import path from "path";
import uuid from "uuid/v4";
import multer from "multer";
import { writeFileSync, unlink, existsSync, mkdirSync } from "fs";

const storage = multer.memoryStorage();

const extractResume = multer({
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const ext = filetypes.test(path.extname(file.originalname).toLowerCase());
    mimetype && ext ? cb(null, true) : cb("Invalid file type.", false);
  },
  storage
}).single("resume");

/**
 * Async write to disk
 * @param {String} dest
 * @param {String} buffer
 */
const writeFileAsync = (dest, buffer) =>
  Promise.resolve(writeFileSync(dest, buffer, "base64"));

const existsAsync = dir => Promise.resolve(existsSync(dir));
const mkdirAsync = dir => Promise.resolve(mkdirSync(dir));

const saveBuffer = file =>
  new Promise(async (resolve, reject) => {
    const dir = path.resolve("tmp/");
    const filename = `${uuid()}.pdf`;

    // will make tmp folder is it doesnt exist
    const dirExist = await existsAsync(dir);
    !dirExist && (await mkdirAsync(dir));

    const filepath = `${dir}/${filename}`;

    try {
      await writeFileAsync(filepath, file.buffer);

      resolve(filepath);
    } catch (e) {
      reject(e);
    }
  });

/**
 * Remove path
 * @param {String} path
 */
const cleanup = path =>
  new Promise((resolve, reject) => {
    unlink(path, err => (err ? reject(err) : resolve()));
  });

export default { extractResume, saveBuffer, cleanup };
