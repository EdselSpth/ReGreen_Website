const { db } = require("../config/firebase");

const COLLECTION = "penjemputan";

exports.getAll = async () => {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map((doc) => ({
    firebase_doc_id: doc.id,
    ...doc.data(),
  }));
};

exports.create = async (data) => {
  const docRef = await db.collection(COLLECTION).add(data);
  return docRef.id;
};

exports.update = async (docId, data) => {
  await db.collection(COLLECTION).doc(docId).update(data);
};

exports.delete = async (docId) => {
  await db.collection(COLLECTION).doc(docId).delete();
};
