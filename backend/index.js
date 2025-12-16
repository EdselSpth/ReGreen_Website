const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/keuntungan", require("./routes/keuntungan.routes"));

app.use("/api/bankSampah", require("./routes/bankSampah.routes"));

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});
