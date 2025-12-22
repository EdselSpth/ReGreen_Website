document.addEventListener("DOMContentLoaded", () => {
    const rowsPerPage = 5;
    let pendingData = [], historyData = [];

    const tblPending = document.querySelector("#tableBody");
    const tblHistory = document.querySelector("#tableHistoryBody");
    const pagPending = document.querySelector("#paginationPending");
    const pagHistory = document.querySelector("#paginationHistory");

    loadPending();
    loadHistory();

    async function loadPending() {
        try {
            const res = await fetch("http://localhost:3000/api/keuntungan");
            const response = await res.json();
            pendingData = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
            displayTable(pendingData, tblPending, pagPending, 1, 'pending');
        } catch (err) { console.error("Error pending:", err); }
    }

    async function loadHistory() {
        try {
            const res = await fetch("http://localhost:3000/api/keuntungan/history");
            const response = await res.json();
            historyData = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
            displayTable(historyData, tblHistory, pagHistory, 1, 'history');
        } catch (err) { console.error("Error history:", err); }
    }

    function displayTable(data, table, pagination, page, type) {
        table.innerHTML = "";
        let start = (page - 1) * rowsPerPage;
        let end = start + rowsPerPage;
        let paginatedItems = data.slice(start, end);

        if (paginatedItems.length === 0) {
            table.innerHTML = `<tr><td colspan="7" style="text-align:center">Tidak ada data</td></tr>`;
            pagination.innerHTML = "";
            return;
        }

        paginatedItems.forEach((item, i) => {
            const tr = document.createElement("tr");
            const rowNo = start + i + 1;
            if (type === 'pending') {
                tr.innerHTML = `
                    <td>${rowNo}</td>
                    <td>${item.nama_pengguna}</td>
                    <td style="font-weight:bold">Rp ${(item.saldo_user || 0).toLocaleString('id-ID')}</td>
                    <td style="color:#e67e22; font-weight:bold">Rp ${item.nominal.toLocaleString('id-ID')}</td>
                    <td>${item.rekening}</td>
                    <td>${item.metode}</td>
                    <td>
                        <button class="btn-aksi btn-simpan" onclick="updateStatus(${item.id}, 'diterima')">Terima</button>
                        <button class="btn-aksi btn-batal" onclick="updateStatus(${item.id}, 'ditolak')">Tolak</button>
                    </td>`;
            } else {
                const sClass = item.status === 'diterima' ? 'accepted' : 'rejected';
                tr.innerHTML = `
                    <td>${rowNo}</td>
                    <td>${item.nama_pengguna}</td>
                    <td>Rp ${item.nominal.toLocaleString('id-ID')}</td>
                    <td>${item.rekening}</td>
                    <td>${item.metode}</td>
                    <td><span class="status-text ${sClass}">${item.status.toUpperCase()}</span></td>
                    <td><button class="btn-aksi btn-batal" onclick="deleteData(${item.id})">Hapus</button></td>`;
            }
            table.appendChild(tr);
        });
        setupPagination(data, pagination, page, type);
    }

    function setupPagination(data, wrapper, currentPage, type) {
        wrapper.innerHTML = "";
        let pageCount = Math.ceil(data.length / rowsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            let btn = document.createElement('button');
            btn.innerText = i;
            btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            btn.onclick = () => displayTable(data, (type==='pending'?tblPending:tblHistory), (type==='pending'?pagPending:pagHistory), i, type);
            wrapper.appendChild(btn);
        }
    }

    document.getElementById("formTambah").onsubmit = async (e) => {
        e.preventDefault();

        const nominal = parseInt(document.getElementById("nominal").value);
        const rekening = document.getElementById("rekening").value;

        // VALIDASI NOMINAL MINIMAL 20.000
        if (nominal < 20000) {
            Swal.fire("Gagal", "Minimal penarikan adalah Rp 20.000", "warning");
            return;
        }

        // VALIDASI REKENING (10-15 DIGIT)
        if (rekening.length < 10) {
            Swal.fire("Gagal", "Nomor rekening minimal 10 digit", "warning");
            return;
        }

        const data = {
            nama_pengguna: document.getElementById("nama_pengguna").value,
            nominal: nominal,
            rekening: rekening,
            metode: document.getElementById("metode").value,
            firebase_uid: "ADMIN-ENTRY-" + Date.now()
        };

        try {
            const res = await fetch("http://localhost:3000/api/keuntungan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                Swal.fire("Sukses", "Data berhasil ditambah", "success").then(() => location.reload());
            }
        } catch (err) {
            Swal.fire("Error", "Gagal menghubungi server", "error");
        }
    };
});

// Fungsi Global Modal
function openModal() { 
    const m = document.getElementById("modalTambah"); 
    m.style.display="flex"; 
    setTimeout(() => m.classList.add("active"), 10); 
}
function closeModal() { 
    const m = document.getElementById("modalTambah"); 
    m.classList.remove("active"); 
    setTimeout(() => m.style.display="none", 300); 
}

// Fungsi Global Update Status
async function updateStatus(id, s) {
    const resConfirm = await Swal.fire({ title: 'Konfirmasi', text: `Ubah status ke ${s}?`, showCancelButton: true });
    if (!resConfirm.isConfirmed) return;

    try {
        const response = await fetch(`http://localhost:3000/api/keuntungan/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: s })
        });
        const result = await response.json();
        if (response.ok) {
            Swal.fire("Berhasil", result.message, "success").then(() => location.reload());
        } else {
            Swal.fire("Gagal", result.message, "error");
        }
    } catch (err) { Swal.fire("Error", "Koneksi bermasalah", "error"); }
}

async function deleteData(id) {
    const resConfirm = await Swal.fire({ title: 'Hapus data?', icon: 'warning', showCancelButton: true });
    if (resConfirm.isConfirmed) {
        await fetch(`http://localhost:3000/api/keuntungan/${id}`, { method: "DELETE" });
        location.reload();
    }
}