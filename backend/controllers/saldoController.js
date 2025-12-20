const { db, admin } = require('../config/firebase');
const { success, error } = require('../utils/response');

const topUpSaldo = async (req, res) => {
    const { userId, amount, adminName } = req.body;

    if (!userId || !amount){
        return error(res, 400, "User ID dan amount wajib diisi");
    }

    const userRef = db.collection('users').doc(userId);
    const transactionRef = db.collection('transactions').doc();

    try {
        let resultData = {};

        await db.runTransaction(async (T) =>{
            const doc = await T.get(userRef);

            if (!doc.exists) {
                throw new Error("User tidak ditemukan di Firestore");
            }

            const userData = doc.data(); 
            const currentBalance = userData.balance || 0;

            const topUpAmount = Number(amount);
            const newBalance = currentBalance + topUpAmount;

            T.update(userRef, { 
                balance: newBalance,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            T.set(transactionRef, {
                userId: userId,
                type: 'TOPUP',
                amount: topUpAmount,
                previousBalance: currentBalance,
                finalBalance: newBalance,
                description: `Top up saldo oleh Admin ${adminName || 'System'}`,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            resultData = {
                userId: userId,
                previousBalance: currentBalance,
                amountAdded: topUpAmount,
                newBalance: newBalance
            };
        });

        return success(res, 200, resultData, "Top up saldo berhasil");
    } catch (err){
        console.error('Gagal Top Up:', err.message);

        if (err.message === "User tidak ditemukan di Firestore") {
            return error(res, 404, err.message);
        }

        return error(res, 500, err.message || "Terjadi kesalahan pada server");
    }
}

module.exports = { topUpSaldo };