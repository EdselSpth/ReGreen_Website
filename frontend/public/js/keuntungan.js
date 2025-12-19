document.addEventListener("DOMContentLoaded", () => {
    console.log("keuntungan.js loaded");

    const tblPending = document.querySelector("#tblPending tbody");
    const tblHistory = document.querySelector("#tblHistory tbody");

    // Panggil fungsi saat halaman dimuat
    loadPending();
    loadHistory();

    // --- FUNGSI LOAD DATA ---

    function loadPending() {
        fetch("http://localhost:3000/api/keuntungan")
            .then(res => res.json())
            .then(response => {
                console.log("Response PENDING:", response);
                tblPending.innerHTML = "";

                // Menangani dua kemungkinan: 
                // 1. Array langsung: [{}, {}] 
                // 2. Dibungkus utility success: { data: [{}, {}] }
                const rows = Array.isArray(response) ? response : response.data;

                if (rows && Array.isArray(rows)) {
                    rows.forEach(item => addPendingRow(item));
                    updateNumber(tblPending);
                } else {
                    console.warn("Format data pending tidak sesuai atau kosong");
                }
            })
            .catch(err => console.error("Pending error:", err));
    }

    function loadHistory() {
        fetch("http://localhost:3000/api/keuntungan/history")
            .then(res => res.json())
            .then(response => {
                console.log("Response HISTORY:", response);
                
                // PERBAIKAN: Sebelumnya innerHTML("") yang menyebabkan error
                tblHistory.innerHTML = ""; 

                const rows = Array.isArray(response) ? response : response.data;

                if (rows && Array.isArray(rows)) {
                    rows.forEach(item => addHistoryRow(item));
                    updateNumber(tblHistory);
                } else {
                    console.warn("Format data history tidak sesuai atau kosong");
                }
            })
            .catch(err => console.error("History error:", err));
    }

    // --- FUNGSI MANIPULASI DOM ---

    function addPendingRow(item) {
        const tr = document.createElement("tr");
        tr.dataset.id = item.id;

        tr.innerHTML = `
            <td></td>
            <td>${item.nama_pengguna || "Tanpa Nama"}</td>
            <td>Rp ${Number(item.nominal || 0).toLocaleString("id-ID")}</td>
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

        // Tentukan class warna berdasarkan status
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

// Fungsi updateStatus diletakkan di luar DOMContentLoaded agar bisa dipanggil atribut onclick
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
            location.reload(); // Refresh halaman untuk melihat perubahan
        } else {
            const errData = await response.json();
            alert("Gagal update: " + (errData.message || "Unknown error"));
        }
    } catch (err) {
        console.error("Update error:", err);
        alert("Terjadi kesalahan koneksi");
    }
}