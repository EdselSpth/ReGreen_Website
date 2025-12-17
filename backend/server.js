require("./scripts/migrateKeuntungan");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/keuntungan", require("./routes/keuntungan.routes"));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
