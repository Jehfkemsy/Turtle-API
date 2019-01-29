import mongoose from "mongoose";

const { MONGO_USER, MONGO_PASSWORD, MONGO_URI } = process.env;

const options = {
  user: MONGO_USER,
  pass: MONGO_PASSWORD,
  useNewUrlParser: true,
  useCreateIndex: true,
  dbName: "mango2019",
  useFindAndModify: false
};

const db = () =>
  Promise.resolve(
    mongoose.connect(
      MONGO_URI,
      options
    )
  );

db()
  .then(() => console.log("> 🗄  Mongo connected"))
  .catch(e => console.log("> Mongo error ", e.message));
