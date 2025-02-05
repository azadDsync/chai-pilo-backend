const express = require("express");
const Entry = require("../models/Entry");
const authMiddleware = require("../middleware/middleware");
const entriesRoutes = express.Router();

entriesRoutes.get("/", async (req, res) => {
  try {
    
    const entries = await Entry.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

entriesRoutes.post("/", authMiddleware, async (req, res) => {
  try {
    const { date, doodh_laya, bartan_dhoya } = req.body;
    
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


module.exports = entriesRoutes;
