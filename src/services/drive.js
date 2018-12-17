import { google } from "googleapis";
import { Duplex } from "stream";

const {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_FOLDER_ID
} = process.env;

const SCOPE = "https://www.googleapis.com/auth/drive";

const auth = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  [SCOPE]
);

const drive = google.drive("v3");

const asyncUpload = (drive, payload) =>
  new Promise((resolve, reject) => {
    drive.files.create(payload, (err, res) => {
      if (err) reject(err);

      resolve(res.data);
    });
  });

const bufferToStream = buffer => {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const upload = async (file, filename) => {
  const { mimetype, buffer } = file;

  try {
    await auth.authorize();

    const resource = { name: filename, parents: [GOOGLE_FOLDER_ID] };

    const media = { mimeType: mimetype, body: bufferToStream(buffer) };

    const payload = { auth, resource, media, fields: "webViewLink" };

    const { webViewLink } = await asyncUpload(drive, payload);

    return webViewLink;
  } catch (err) {
    throw err;
  }
};

export default { upload };
