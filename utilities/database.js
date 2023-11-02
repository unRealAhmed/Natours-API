const mongoose = require('mongoose');

module.exports = async function connectDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PASSWORD));
    console.log('Database Connected Successfully...');
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
  }
};
