const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = path.resolve("token.json");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_FOLDER_ID
} = process.env;

const credentials = {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
};

const authorize = credentials =>
  new Promise((resolve, reject) => {
    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    } = credentials;

    const oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) reject(getAccessToken(oAuth2Client, null));

      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
    });
  });

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

const uploadResume = file =>
  new Promise(async (resolve, reject) => {
    try {
      const auth = await authorize(credentials);

      const drive = google.drive({ version: "v3", auth });
      const fileMetadata = {
        name: file.originalname,
        parents: [GOOGLE_FOLDER_ID]
      };
      const media = {
        mimeType: file.mimeType,
        body: fs.createReadStream(file.path)
      };

      const payload = { resource: fileMetadata, media: media, fields: "id" };

      drive.files.create(payload, (err, file) => {
        if (err) reject(err.message);
        const { id } = file.data;
        const resume_url = `https://drive.google.com/file/d/${id}/view`;
        resolve({ resume_url });
      });
    } catch (e) {
      reject(e);
    }
  });

export default { uploadResume };
