import jwt from "jsonwebtoken";
const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }

  let token = authorization.split(" ")[1];

  try {
    let decoded = await jwt.verify(token, SECRET_KEY);
    let key = decoded.secretKey;
    if (key !== SECRET_KEY) {
      return res.status(401).send("Unauthorized");
    }

    next();
  } catch (e) {
    return res.status(401).send("Unauthorized");
  }
};

export default authCreator;
