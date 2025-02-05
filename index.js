const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const entrySchema = new mongoose.Schema({
  date: String,
  doodh_laya: String,
  bartan_dhoya: String,
});

const Entry = mongoose.model("Entry", entrySchema);

app.get("/entries", async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/entries", async (req, res) => {
  try {
    const { date, doodh_laya, bartan_dhoya ,password } = req.body;
    // if (password !="admin") {
    //   res.status(200).json({ message: "wrong password!" });
    // }
    let entry = await Entry.findOne({ date });
    if (!entry) {
      entry = new Entry({ date, doodh_laya: "", bartan_dhoya: "" });
    }
    if (doodh_laya) entry.doodh_laya = doodh_laya;
    if (bartan_dhoya) entry.bartan_dhoya = bartan_dhoya;
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
