const express = require("express");
const { connectToDatabase } = require("./mongo");
const gatewayRoutes = require("./routes/gateways");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Create Express app
const app = express();

const { PORT, TEST_PORT, NODE_ENV } = process.env;

// Set the port based on the environment variable or use 5000 as the default port
const port = NODE_ENV === "test" ? TEST_PORT : PORT || 5000;

// Connect to the database
connectToDatabase();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(cookieParser()); // Parse cookies in incoming requests
app.use(express.json()); // Parse JSON in request bodies

// Routes
app.use("/gateways", gatewayRoutes); // Mount the gateway routes at the "/gateways" path

// Start the server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = {
  app,
  server
};
