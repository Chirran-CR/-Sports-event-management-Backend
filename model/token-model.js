const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const tokenCollection = new mongoose.model("tokencolleciton", tokenSchema);
module.exports = tokenCollection;
