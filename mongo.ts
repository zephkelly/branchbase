const mongoose = require('mongoose');

const mongo = mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'));

module.exports = { mongo };