import mongoose from "mongoose";

const { MONGO_USER, MONGO_PASSWORD, MONGO_URI } = process.env;

// const options = {
//   // user: MONGO_USER,
//   // pass: MONGO_PASSWORD,
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   dbName: "passport-tutorial",
//   useFindAndModify: false
// };

const server = 'localhost:27017';
const database = 'passport-tutorial'

const db = () =>
  Promise.resolve(
    mongoose.connect(
      MONGO_URI
    )
  );

db()
  .then(() => console.log("> 🗄  Mongo connected"))
  .catch(e => console.log("> Mongo error ", e.message));
  