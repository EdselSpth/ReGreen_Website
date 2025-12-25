
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
    area = areaDoc.exists ? { id: areaDoc.id, ...areaDoc.data() } : null;
  }

  results.push({
    uid: userDoc.id,
    username: u.username ?? u.name ?? null,
    email: u.email ?? null,
    phone: u.phone ?? u.noHp ?? null,
    areaStatus: u.areaStatus ?? null,
    areaId: areaId ?? null,
    area,
  });
}


  return results;
}


async function updateAreaRequest(uid, action) {
  const userRef = db.collection("users").doc(String(uid));
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const err = new Error("User tidak ditemukan di Firestore");
    err.statusCode = 404;
    throw err;
  }

  const u = userDoc.data();
  const areaId = u.areaId ?? null;

  if (action === "approve") {
    await userRef.update({ areaStatus: "approved" });
    return { uid, areaId, areaStatus: "approved" };
  }

  if (action === "reject") {
    await userRef.update({ areaStatus: "notRegistered", areaId: null });
    return { uid, areaId, areaStatus: "notRegistered" };
  }

  const err = new Error("action harus 'approve' atau 'reject'");
  err.statusCode = 400;
  throw err;
}

module.exports = { listAreaRequests, updateAreaRequest };
