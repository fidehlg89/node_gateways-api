const mongoose = require("mongoose");

async function connectToDatabase() {
  const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env;

  const connectionString = NODE_ENV === "test" ? MONGODB_URI_TEST : MONGODB_URI;

  mongoose
    .connect(`${connectionString}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { connectToDatabase };
