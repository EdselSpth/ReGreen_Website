require("./scripts/migrateKeuntungan");
require("./scripts/migratebankSampah");
require("./scripts/migrateVideo");
require("./scripts/migrateArtikel");
require("./scripts/migrateAreaUser");
require("./scripts/migrateAreaAdmin");
require("./scripts/migrateJenisSampah")

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/keuntungan", require("./routes/keuntungan.routes"));
app.use("/api/bankSampah", require("./routes/bankSampah.routes"));
app.use("/api/video", require("./routes/videoEdukasi.routes"));
app.use("/api/artikel", require("./routes/artikelEdukasi.routes"));
app.use("/api/area", require("./routes/pendaftaranAreaUser.routes"));
app.use("/api/areaAdm", require("./routes/pendaftaranAreaAdmin.routes"));
app.use("/api/jenisSampah", require("./routes/jenisSampah.routes"));
app.use("/api/saldo", require("./routes/saldo.routes"));
app.use("/api/users", require("./routes/users.routes"));

app.listen(3000 ,() => {
  console.log("Server running at http://localhost:3000");
});
