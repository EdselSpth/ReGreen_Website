document.addEventListener("DOMContentLoaded", () => {
    console.log("keuntungan.js loaded");

    const tblPending = document.querySelector("#tblPending tbody");
    const tblHistory = document.querySelector("#tblHistory tbody");
    const formTambah = document.querySelector("#formTambah");

    // --- INITIAL LOAD ---
    loadPending();
    loadHistory();

    // --- EVENT LISTENER FOR FORM TAMBAH ---
    if (formTambah) {
        formTambah.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Mengambil value dari input
            const nama_pengguna = document.getElementById("nama_pengguna").value;
            const nominal = document.getElementById("nominal").value;
            const rekening = document.getElementById("rekening").value;
            const metode = document.getElementById("metode").value;

            // 1. VALIDASI REKENING (Hanya angka, 10-15 digit)
            const rekRegex = /^[0-9]{10,15}$/;
            if (!rekRegex.test(rekening)) {
                alert("Nomor rekening tidak valid! Harus berupa angka 10-15 digit.");
                return;
            }

            // 2. VALIDASI NOMINAL
            if (parseInt(nominal) < 1000) {
                alert("Nominal penarikan minimal Rp 1.000");
                return;
            }

            const data = {
                firebase_uid: "ADMIN-ENTRY-" + Date.now(), // UID dummy untuk input manual admin
                nama_pengguna,
                nominal: parseInt(nominal),
                rekening,
                metode
            };

            try {
                const res = await fetch("http://localhost:3000/api/keuntungan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (res.ok) {
                    alert("Data penarikan berhasil ditambahkan!");
                    closeModal();
                    location.reload();
                } else {
                    alert("Gagal menambah data: " + result.message);
                }
            } catch (err) {
                console.error("Create error:", err);
                alert("Terjadi kesalahan koneksi saat menambah data");
            }
        });
    }

    // --- FUNGSI LOAD DATA ---

    function loadPending() {
        fetch("http://localhost:3000/api/keuntungan")
            .then(res => res.json())
            .then(response => {
                tblPending.innerHTML = "";
                const rows = Array.isArray(response) ? response : response.data;

                if (rows && rows.length > 0) {
                    rows.forEach(item => addPendingRow(item));
                    updateNumber(tblPending);
                } else {
                    tblPending.innerHTML = "<tr><td colspan='6' style='text-align:center'>Tidak ada data pending</td></tr>";
                }
            })
            .catch(err => console.error("Pending error:", err));
    }

    function loadHistory() {
        fetch("http://localhost:3000/api/keuntungan/history")
            .then(res => res.json())
            .then(response => {
                tblHistory.innerHTML = ""; 
                const rows = Array.isArray(response) ? response : response.data;

                if (rows && rows.length > 0) {
                    rows.forEach(item => addHistoryRow(item));
                    updateNumber(tblHistory);
                } else {
                    tblHistory.innerHTML = "<tr><td colspan='7' style='text-align:center'>Riwayat kosong</td></tr>";
                }
            })
            .catch(err => console.error("History error:", err));
    }

    // --- FUNGSI MANIPULASI DOM ---

function addPendingRow(item) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td></td>
        <td>${item.nama_pengguna || "Tanpa Nama"}</td>
        <td style="font-weight: bold; color: #2c3e50;">Rp ${Number(item.saldo_user || 0).toLocaleString("id-ID")}</td>
        <td style="color: #e67e22; font-weight: bold;">Rp ${Number(item.nominal || 0).toLocaleString("id-ID")}</td>
        <td>${item.rekening ?? "-"}</td>
        <td>${item.metode ?? "-"}</td>
        <td>
            <button class="btn btn-terima" onclick="updateStatus(${item.id}, 'diterima')">Terima</button>
            <button class="btn btn-tolak" onclick="updateStatus(${item.id}, 'ditolak')">Tolak</button>
        </td>
    `;
    tblPending.appendChild(tr);
}

    function addHistoryRow(item) {
        const tr = document.createElement("tr");
        const statusClass = item.status === "diterima" ? "accepted" : "rejected";

        tr.innerHTML = `
            <td></td>
            <td>${item.nama_pengguna || "Tanpa Nama"}</td>
            <td>Rp ${Number(item.nominal || 0).toLocaleString("id-ID")}</td>
            <td>${item.rekening ?? "-"}</td>
            <td>${item.metode ?? "-"}</td>
            <td>
                <span class="status-text ${statusClass}">
                    ${item.status.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn btn-tolak" style="padding: 4px 8px; font-size: 11px;" onclick="deleteData(${item.id})">Hapus</button>
            </td>
        `;
        tblHistory.appendChild(tr);
    }

    function updateNumber(tbody) {
        [...tbody.rows].forEach((row, i) => {
            if (row.cells[0]) {
                row.cells[0].innerText = i + 1;
            }
        });
    }
});

// --- FUNGSI GLOBAL (DI LUAR DOMContentLoaded) ---

// Fungsi Modal
function openModal() {
    document.getElementById("modalTambah").style.display = "flex";
}

function closeModal() {
    document.getElementById("modalTambah").style.display = "none";
}

// Fungsi Update Status (Terima/Tolak)
async function updateStatus(id, status) {
    if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) return;

    try {
        const response = await fetch(`http://localhost:3000/api/keuntungan/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            alert("Status berhasil diperbarui");
            location.reload();
        } else {
            const errData = await response.json();
            alert("Gagal update: " + (errData.message || "Unknown error"));
        }
    } catch (err) {
        console.error("Update error:", err);
        alert("Terjadi kesalahan koneksi");
    }
}

// Fungsi Delete Permanen
async function deleteData(id) {
    if (!confirm("Data akan dihapus secara permanen dari database. Lanjutkan?")) return;

    try {
        const response = await fetch(`http://localhost:3000/api/keuntungan/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Data berhasil dihapus!");
            location.reload();
        } else {
            alert("Gagal menghapus data.");
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Terjadi kesalahan koneksi");
    }
}