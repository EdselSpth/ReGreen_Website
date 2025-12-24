const { db } = require("../config/firebase");
const admin = require("firebase-admin");


exports.approveArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    const areaRef = db.collection("areas").doc(areaId);
    const areaSnap = await areaRef.get();

    if (!areaSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Area tidak ditemukan",
      });
    }

    const areaData = areaSnap.data();

    if (areaData.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Area sudah di-approve",
      });
    }

    if (!areaData.userId) {
      return res.status(400).json({
        success: false,
        message: "User pemilik area tidak ditemukan",
      });
    }

    //update area
    await areaRef.update({
      status: "approved",
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // update user
    await db.collection("users").doc(areaData.userId).update({
      areaStatus: "approved",
    });

    return res.json({
      success: true,
      message: "Area berhasil di-approve",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal approve area",
    });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    await db.collection("areas").doc(areaId).delete();

    return res.json({
      success: true,
      message: "Area berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus area",
    });
  }
};
