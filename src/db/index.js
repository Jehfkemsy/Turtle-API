import mongoose from "mongoose";

const { MONGO_USER, MONGO_PASSWORD, MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  dbName: "shellhacks",
  useFindAndModify: false
};

const db = () =>
  Promise.resolve(
    mongoose.connect(
      "mongodb://localhost:27017/shellhacks",
      options
    )
  );

db()
  .then(() => console.log("> 🗄  Mongo connected"))
  .catch(e => console.log("> Mongo error ", e.message));






