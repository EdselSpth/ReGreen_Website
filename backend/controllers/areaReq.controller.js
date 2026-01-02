const areaReqSvc = require("../services/areaReq.service");
const areaMasterSvc = require("../services/areaMaster.service");

exports.list = async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const data = await areaReqSvc.listAreaRequests(status);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in area request controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { uid } = req.params;
    const { action, reason } = req.body; 
    const result = await areaReqSvc.updateAreaRequest(uid, action, reason);


    if (action === "approve") {
      const requests = await areaReqSvc.listAreaRequests("approved");
      const row = requests.find((x) => String(x.uid) === String(uid));

      if (row) {
        await areaMasterSvc.create({
          kecamatan: row.kecamatan || row.area?.kecamatan || "",
          kelurahan: row.kelurahan || row.area?.kelurahan || "",
          kota: row.kota || row.area?.kota || "",
          provinsi: row.provinsi || row.area?.provinsi || "",
          jalan: row.jalan || row.area?.jalan || "",
        });
      }
    }

    res.status(200).json({ 
      ok: true, 
      message: `Status berhasil diubah ke ${action}`,
      result 
    });

  } catch (e) {
    console.error("Gagal update area:", e);
    res.status(e.statusCode || 500).json({ message: e.message });
  }
};