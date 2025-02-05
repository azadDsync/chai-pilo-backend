const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  date: String,
  doodh_laya: String,
  bartan_dhoya: String,
});

const Entry = mongoose.model("Entry", entrySchema);
module.exports = Entry;