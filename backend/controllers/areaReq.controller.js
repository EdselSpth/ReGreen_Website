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
    const { action, alsoRegister } = req.body;

    const result = await areaReqSvc.updateAreaRequest(uid, action);

    if (action === "approve" && alsoRegister) {
      const approvedList = await areaReqSvc.listAreaRequests("approved");
      const row = approvedList.find((x) => x.uid === String(uid));

      if (!row) {
        return res.status(404).json({ message: "Area tidak ditemukan di daftar approved" });
      }

      try {
        await areaMasterSvc.create({
          kecamatan: row.area.kecamatan ?? "",
          kelurahan: row.area.kelurahan ?? "",
          kota: row.area.kota ?? "",
          provinsi: row.area.provinsi ?? "",
          jalan: row.area.jalan ?? "",
        });
      } catch (err) {
        if (err.statusCode !== 409) throw err; 
      }
    }

    res.status(200).json({ ok: true, result });
  } catch (e) {
    res.status(e.statusCode || 500).json({ message: e.message });
  }
};
