const { db } = require("../config/firebase");
const admin = require("firebase-admin");

/**
 * GET semua area
 */
exports.getAllAreas = async (req, res) => {
  try {
    const snapshot = await db.collection("areas").get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil semua area"
    });
  }
};

/**
 * GET area pending
 */
exports.getPendingAreas = async (req, res) => {
  try {
    const snapshot = await db
      .collection("areas")
      .where("status", "==", "pending")
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil area pending"
    });
  }
};

/**
 * APPROVE area
 */
exports.approveArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    const areaRef = db.collection("areas").doc(areaId);
    const areaSnap = await areaRef.get();

    if (!areaSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Area tidak ditemukan"
      });
    }

    const areaData = areaSnap.data();

    if (areaData.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Area sudah di-approve"
      });
    }

    if (!areaData.userId) {
      return res.status(400).json({
        success: false,
        message: "User pemilik area tidak ditemukan"
      });
    }

    // Update area
    await areaRef.update({
      status: "approved",
      approvedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user
    await db.collection("users").doc(areaData.userId).update({
      areaStatus: "approved"
    });

    return res.json({
      success: true,
      message: "Area berhasil di-approve"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal approve area"
    });
  }
};

/**
 * REJECT area
 */
exports.rejectArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    await db.collection("areas").doc(areaId).update({
      status: "rejected",
      rejectedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({
      success: true,
      message: "Area berhasil ditolak"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal menolak area"
    });
  }
};

/**
 * DELETE area
 */
exports.deleteArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    await db.collection("areas").doc(areaId).delete();

    return res.json({
      success: true,
      message: "Area berhasil dihapus"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus area"
    });
  }
};
