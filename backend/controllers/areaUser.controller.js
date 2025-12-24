const db = require("../config/db");


exports.createArea = async (req, res) => {
  const {
    userId,
    jalan,
    kelurahan,
    kecamatan,
    kota,
    provinsi,
  } = req.body;

  //simpan data area
  const areaRef = await db.collection('areas').add({
    userId,
    jalan,
    kelurahan,
    kecamatan,
    kota,
    provinsi,
    status: 'pending',
    createdAt: new Date(),
  });

  // update status area di user
  await db.collection('users').doc(userId).update({
    areaStatus: 'pending',
    areaId: areaRef.id,
  });

  res.status(201).json({
    message: 'Area berhasil didaftarkan',
    areaId: areaRef.id,
  });
};
