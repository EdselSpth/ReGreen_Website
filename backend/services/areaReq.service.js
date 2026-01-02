const { db } = require("../config/firebase");

async function listAreaRequests(status = "pending") {
  const usersSnap = await db
    .collection("users")
    .where("areaStatus", "==", status)
    .get();

  const results = [];
  for (const userDoc of usersSnap.docs) {
    const u = userDoc.data();
    const areaId = u.areaId;

    let area = null;
    if (areaId) {
      const areaDoc = await db.collection("areas").doc(String(areaId)).get();
      if (areaDoc.exists) {
        area = { id: areaDoc.id, ...areaDoc.data() };
      }
    }

    if (!area && u.address) {
      area = {
        jalan: u.address.jalan ?? "",
        kecamatan: u.address.kecamatan ?? "",
        kelurahan: u.address.kelurahan ?? "",
        kota: u.address.kota ?? "",
        provinsi: u.address.provinsi ?? ""
      };
    }

    results.push({
      uid: userDoc.id,
      username: u.username ?? u.name ?? null,
      email: u.email ?? null,
      phone: u.phone ?? u.noHp ?? null,
      areaStatus: u.areaStatus ?? null,
      areaId: areaId ?? null,
      areaRejectionReason: u.areaRejectionReason ?? "", 
      area: area || {}, 
    });
  }
  return results;
}

async function updateAreaRequest(uid, action, reason = "") {
  const userRef = db.collection("users").doc(String(uid));
  const userDoc = await userRef.get();

  if (!userDoc.exists) throw new Error("User tidak ditemukan");

  if (action === "approve") {
    await userRef.update({ 
      areaStatus: "approved",
      areaRejectionReason: "" 
    });
    return { uid, status: "approved" };
  } else if (action === "reject") {
    await userRef.update({ 
      areaStatus: "notRegistered", 
      areaId: null,
      areaRejectionReason: reason
    });
    return { uid, status: "notRegistered", reason };
  }
  throw new Error("Action invalid");
}

module.exports = { listAreaRequests, updateAreaRequest };