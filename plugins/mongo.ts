const mongoose = require('mongoose');
require('dotenv').config();

export default defineNuxtPlugin(async (nuxtContext) => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION);
    console.log("DB connection established.");
  } catch (err) {
    console.error("DB connection failed.", err);
  }
})
