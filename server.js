const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const rootRouter = require("./router/rootRoute");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


connectDB();


app.use("/api/v1", rootRouter);


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
