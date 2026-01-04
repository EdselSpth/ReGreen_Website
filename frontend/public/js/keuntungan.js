document.addEventListener("DOMContentLoaded", () => {
    const rowsPerPage = 5;
    let pendingData = [], historyData = [];
    
    // State Halaman
    let currentPendingPage = 1;
    let currentHistoryPage = 1;

    const tblPending = document.querySelector("#tableBody");
    const tblHistory = document.querySelector("#tableHistoryBody");
    
    const pagPendingWrapper = document.querySelector("#paginationPending");
    const pagHistoryWrapper = document.querySelector("#paginationHistory");
    
    const infoPending = document.querySelector("#pending-page-info");
    const infoHistory = document.querySelector("#history-page-info");

    // Ambil Token CSRF dari meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Inisialisasi Load Data
    loadPending();
    loadHistory();

    // --- 1. FUNGSI LOAD DATA (READ) ---
    async function loadPending() {
        try {
            const res = await fetch("/proxy-keuntungan");
            const response = await res.json();
            pendingData = response.data || [];
            displayTable(pendingData, tblPending, pagPendingWrapper, currentPendingPage, 'pending', infoPending);
        } catch (err) { console.error("Error pending:", err); }
    }

    async function loadHistory() {
        try {
            const res = await fetch("/proxy-keuntungan/history");
            const response = await res.json();
            historyData = response.data || [];
            displayTable(historyData, tblHistory, pagHistoryWrapper, currentHistoryPage, 'history', infoHistory);
        } catch (err) { console.error("Error history:", err); }
    }

    // --- 2. FUNGSI SIMPAN DATA (CREATE) ---
    const formTambah = document.querySelector("#formTambah");
    if (formTambah) {
        formTambah.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                nama_pengguna: document.getElementById("nama_pengguna").value,
                nominal: parseInt(document.getElementById("nominal").value),
                rekening: document.getElementById("rekening").value,
                metode: document.getElementById("metode").value,
                firebase_uid: "ADMIN-WEB" // Penanda jika ditambah lewat web
            };

            try {
                const response = await fetch("/proxy-keuntungan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    Swal.fire('Berhasil', 'Penarikan berhasil diajukan', 'success')
                        .then(() => {
                            closeModal();
                            loadPending(); // Refresh tabel tanpa reload halaman
                            formTambah.reset();
                        });
                } else {
                    const err = await response.json();
                    Swal.fire('Gagal', err.message || 'Gagal menyimpan data', 'error');
                }
            } catch (e) {
                console.error("Error Store:", e);
                Swal.fire('Error', 'Gagal menghubungi server', 'error');
            }
        });
    }

    // --- 3. LOGIKA TAMPILAN TABEL & PAGINATION (TIDAK BERUBAH DESAINNYA) ---
    function displayTable(data, table, paginationWrapper, page, type, infoElement) {
        table.innerHTML = "";
        let start = (page - 1) * rowsPerPage;
        let end = start + rowsPerPage;
        let paginatedItems = data.slice(start, end);

        if (paginatedItems.length === 0) {
            const colSpan = type === 'pending' ? 7 : 8;
            table.innerHTML = `<tr><td colspan="${colSpan}" style="text-align:center">Tidak ada data</td></tr>`;
            paginationWrapper.innerHTML = "";
            infoElement.innerText = "";
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
                let alasanBtn = `<span class="no-alasan">-</span>`;
                if (item.status === 'ditolak' && item.alasan_tolak) {
                    const escapedAlasan = item.alasan_tolak.replace(/'/g, "\\'");
                    alasanBtn = `<button class="btn-alasan" onclick="lihatAlasan('${escapedAlasan}')">Lihat</button>`;
                }

                tr.innerHTML = `
                    <td>${rowNo}</td>
                    <td>${item.nama_pengguna}</td>
                    <td>Rp ${item.nominal.toLocaleString('id-ID')}</td>
                    <td>${item.rekening}</td>
                    <td>${item.metode}</td>
                    <td><span class="status-text ${sClass}">${item.status.toUpperCase()}</span></td>
                    <td>${alasanBtn}</td>
                    <td><button class="btn-aksi btn-batal" onclick="deleteData(${item.id})">Hapus</button></td>`;
            }
            table.appendChild(tr);
        });

        setupPagination(data, paginationWrapper, page, type, infoElement);
    }

    function setupPagination(data, wrapper, currentPage, type, infoElement) {
        wrapper.innerHTML = "";
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / rowsPerPage);

        infoElement.innerText = `Halaman ${currentPage} dari ${totalPages} (Total: ${totalItems})`;

        const btnPrev = document.createElement("button");
        btnPrev.innerText = "Sebelumnya";
        btnPrev.disabled = currentPage === 1;
        btnPrev.onclick = () => {
            if (type === 'pending') currentPendingPage--; else currentHistoryPage--;
            refreshView(type);
        };
        wrapper.appendChild(btnPrev);

        const btnNext = document.createElement("button");
        btnNext.innerText = "Selanjutnya";
        btnNext.disabled = currentPage === totalPages;
        btnNext.onclick = () => {
            if (type === 'pending') currentPendingPage++; else currentHistoryPage++;
            refreshView(type);
        };
        wrapper.appendChild(btnNext);
    }

    function refreshView(type) {
        if (type === 'pending') {
            displayTable(pendingData, tblPending, pagPendingWrapper, currentPendingPage, 'pending', infoPending);
        } else {
            displayTable(historyData, tblHistory, pagHistoryWrapper, currentHistoryPage, 'history', infoHistory);
        }
    }
});

// --- 4. FUNGSI GLOBAL (DILUAR DOMCONTENTLOADED) ---

function lihatAlasan(teks) {
    Swal.fire({ title: 'Alasan Penolakan', text: teks, icon: 'info', confirmButtonColor: '#558B3E' });
}

function exportData() { 
    window.location.href = "/proxy-keuntungan/export"; 
}

async function updateStatus(id, s) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    let alasan = null;

    if (s === 'ditolak') {
        const { value: text, isConfirmed } = await Swal.fire({
            title: 'Alasan Penolakan',
            input: 'textarea',
            inputPlaceholder: 'Berikan alasan...',
            showCancelButton: true,
            inputValidator: (value) => { if (!value) return 'Alasan wajib diisi!'; }
        });
        if (!isConfirmed) return;
        alasan = text;
    } else {
        const res = await Swal.fire({ title: 'Konfirmasi', text: 'Terima pengajuan ini?', showCancelButton: true });
        if (!res.isConfirmed) return;
    }

    try {
        const response = await fetch(`/proxy-keuntungan/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken 
            },
            body: JSON.stringify({ status: s, alasan: alasan })
        });
        if (response.ok) location.reload();
    } catch (e) { console.error(e); }
}

async function deleteData(id) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const res = await Swal.fire({ title: 'Hapus data?', icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
        await fetch(`/proxy-keuntungan/${id}`, { 
            method: "DELETE",
            headers: { "X-CSRF-TOKEN": csrfToken }
        });
        location.reload();
    }
}

function openModal() { 
    document.getElementById("modalTambah").classList.add("active"); 
    document.getElementById("modalTambah").style.display = "flex"; 
}

function closeModal() { 
    document.getElementById("modalTambah").classList.remove("active"); 
    setTimeout(() => document.getElementById("modalTambah").style.display = "none", 300); 
}