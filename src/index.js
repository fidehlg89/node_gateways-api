const express = require("express");
const { connectToDatabase } = require("./mongo");
const gatewayRoutes = require("./routes/gateways");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Create Express app
const app = express();

const {PORT, TEST_PORT, NODE_ENV}=process.env

const port = NODE_ENV === "test" ? TEST_PORT : PORT || 5000;

// Connect to the database
connectToDatabase();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/gateways", gatewayRoutes);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = {
  app,
  server
};
