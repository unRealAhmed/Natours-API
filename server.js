// Load environment variables
require("dotenv").config({ path: "./config.env" });

// Import the Express app
const app = require("./app");

// Connect to the database
const connectDatabase = require("./utilities/database");

connectDatabase();

// Define the server's port
const port = process.env.PORT || 8000;

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
