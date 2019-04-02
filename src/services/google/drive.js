import { google } from "googleapis";
import { Duplex } from "stream";
import path from "path";
import fs from "fs";
import { WriteStream } from "tty";
import axios from "axios";

const {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_FOLDER_ID
} = process.env;

const SCOPE = "https://www.googleapis.com/auth/drive";

const json = {
  "type": "service_account",
  "project_id": "shellhacks-backend",
  "private_key_id": "cde0f866a225f6ba3839a5c07d135092d1400b49",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAMNLhLu5B5A0E\n2PK0SKrbUIbnLhYWs6GDA9QvBCwgM4ncxcUzw5I6BcdX5E/j/RazD3bz9mG70gxk\nnlnbN16t+66TjFxnm1uGXk7XnK1rVFlXIZNG478fMMPju+wxAxOn0bEZpFzWOX4I\nDWkYKROKzMJ6wj/K2lVQCW3eXSmyHDp1/7O19cdlFsJEKukRBbB/Lt5DwIaqAkx9\niksD0ViKGOOtLTwevspqwkFI2Gc0jL2gwW8r/9bcJPfsIdhBsFirJLPeg3MGRmnb\n+/hyDJs+gPwU5VXWXS9iFqM4lyf8PKW6Vi/3mXE2T2VTLleSyKgtl6+jVF3TasJK\nIXkoU3h5AgMBAAECggEAC1Hs39jT7YNdTXFqVTpY/u82rO/y2t40d4sukKDgKPrk\nJkHrWD3PE3YS7F89IeZ+s2gIJ301+zo3YudNT1tK6zhBa30nVa5pxQexwOMgd0uJ\n8hb/Ddw8/f0xMo0Xb7kYy6gPFH2w/qi2/sosbCECPskJ9PFTUNNMlljh1Oi7m5sS\nHQFeIn39upXKKS/kPq2kT387o8+FGq/oBR+AWe5PHoKI444YsDxkZE3n2QfJp6kG\nVnm2ztAwo8+t9qfUNBykXrd1sjVKXpl/4+rrfIK/enuZ8w+cJ6/QKzXDZDWf9Z97\nVYaP6hnodx27KJts93UZ6y7Od+NzZBb+alKwKepuEQKBgQDrUHTZWEYuG/Gg8igp\nk2anIp8Yo200E4tUANsLaLk7oaGW3/bi87tUVbA8loBZVVkpYCf+XlNaFv5btnEj\nZCNtk61bGoE0gIlvMK+Cse91RJ3wtgZ6iOCE97z90HRpKK6QJWkwP6sFDQt23Nra\nas34YChh0jlUPZ02dYGh5lPe0QKBgQDRFeivasRu5PxC4zzfd+zhHP3rPi3f4iiz\nTDZROfFSO3qhhs6oqZ6fde8/rvYDlEx5SQsXwGsbr+py52Oz6oBPhDUoZC22FAJ3\nNq5Ll7oAg/D+FFUMPjo3GgA1RXMjSIu5ewj5E2OLwJnOBr0Y33Ruk0yopxsrCluq\n7gapRFR5KQKBgQC97f2yZAaZNuLLlkkGbbvgURh6yYXeD5xYnCwwxEEmOWp0nabn\nPfTIuDT8YjmMYVALDlqZfEboo0CAg/xDpZLW4eh9bSI2Xz0OqwwugDIXw997J2CJ\nTKtzh4ZakwMy0aw8GoYRdII0HHhRYyeePbCrtelCM20kamrXRvbv1zmA0QKBgGsf\nR3TARd3vEdOPKvvvLHz1Zp6k38oJzAJ4tIePITWZZa3mLHE7XhqiyK4fDMouq7Ok\nGbvUiMvJqFuwc2OVbKHQwY9tLAJSZCUB7fCqztA+yTTT4/L+2sKqXprsdx4HqBai\nk6lRJrpONj7ZMv7QVY3lh+wMmZ3Gk8qSYvVMHd9pAoGBAMT+5P849ssC3X74g6m6\n952CS1PZ5VvIGKPE9Jox9jJmdV3iXWugx8lpdpHsEQX0EYD6d4GXTsmawPQ9cXCL\nHTFnwUg0cd2IZAXt3z136zL39cGthLHZXcjfosUHlUua0gBAoTQWf5GilOnjYSj3\n7hb3fRO+CmgoVMCH0bARrxFZ\n-----END PRIVATE KEY-----\n",
  "client_email": "shellhacks@shellhacks-backend.iam.gserviceaccount.com",
  "client_id": "109055069957964344807",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/shellhacks%40shellhacks-backend.iam.gserviceaccount.com"
}

const auth = new google.auth.JWT(
  json.client_email,
  null,
  json.private_key,
  [SCOPE]
);

const drive = google.drive("v3");

const asyncUpload = (drive, payload) =>
  new Promise((resolve, reject) => {
    drive.files.create(payload, (err, res) => {
      if (err) console.log(err);

      resolve(res.data);
    });
  });

const asyncDownload = fileId =>
  new Promise((resolve, reject) => {
    const file_path = path.resolve(`tmp/${fileId}.pdf`);
    const dest = fs.createWriteStream(file_path);

    const drive = google.drive("v3");

    drive.files.get(
      { auth, fileId: fileId, alt: "media", mimeType: "application/pdf" },
      {
        responseType: "stream"
      },
      (err, response) => {
        if (err) throw err;

        response.data
          .on("error", err => {
            throw err;
          })
          .on("end", () => {
            resolve(file_path);
          })
          .pipe(dest);
      }
    );
  });

const bufferToStream = buffer => {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const upload = async (file, filename, folder) => {
  const { mimetype, buffer } = file;

  try {
    
    await auth.authorize();
    
    console.log('authorized')
    const resource = { name: filename, parents: ['VBbfbZF4R1wDa4CySGESYhnnETsFhCy8-'] };

    const media = { mimeType: mimetype, body: bufferToStream(buffer) };

    const payload = { auth, resource, media, fields: "webViewLink" };
    

    const { webViewLink } = await asyncUpload(drive, payload);

    return webViewLink;
  } catch (err) {
    throw err;
  }
};

const download = async fileId => {
  try {
    await auth.authorize();

    const dest = await asyncDownload(fileId);

    return dest;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default { upload, download };
