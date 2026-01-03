const API_URL = "http://localhost:3000/api";
let currentNotePage = 1;

document.addEventListener("DOMContentLoaded", () => {
    loadPending();      // Tabel 1 (Database: areaRequests)
    loadRegistered();   // Tabel 2 (Database: areaMaster)
    renderAdminSimpleTable(1); // Tabel 3 (Dimulai dari halaman 1)
});


async function loadPending() {
    try {
        const res = await fetch(`${API_URL}/areaRequests?status=pending`);
        const result = await res.json();
        const table = document.getElementById("pendingAreaTable");
        if(!table) return;
        table.innerHTML = "";

        if (result.data && result.data.length > 0) {
            result.data.forEach((item, i) => {
                table.innerHTML += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${item.area?.jalan || "-"}</td>
                        <td>${item.area?.kecamatan || "-"}</td>
                        <td>${item.area?.kota || "-"}</td>
                        <td>${item.area?.kelurahan || "-"}</td>
                        <td>${item.area?.provinsi || "-"}</td>
                        <td>
                            <button class="btn-aksi btn-simpan" onclick="processAction('${item.uid}', 'approve')">Approve</button>
                            <button class="btn-aksi btn-batal" onclick="processAction('${item.uid}', 'reject')">Reject</button>
                        </td>
                    </tr>`;
            });
        } else {
            table.innerHTML = "<tr><td colspan='7' align='center'>Tidak ada pendaftaran pending</td></tr>";
        }
    } catch (e) { console.error("Error Tabel 1:", e); }
}

async function loadRegistered() {
    try {
        const res = await fetch(`${API_URL}/areaMaster`);
        const data = await res.json();
        
        const table = document.getElementById("registeredAreaTable");
        if(!table) return;
        table.innerHTML = "";
        if (data && data.length > 0) {
            data.forEach((item, i) => {
                table.innerHTML += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${item.jalan || "-"}</td>
                        <td>${item.kecamatan || "-"}</td>
                        <td>${item.kota || "-"}</td>
                        <td>${item.kelurahan || "-"}</td>
                        <td>${item.provinsi || "-"}</td>
                        <td><span class="status-text accepted">Registered</span></td>
                    </tr>`;
            });
        } else {
            table.innerHTML = "<tr><td colspan='7' align='center'>Belum ada area yang terdaftar secara resmi</td></tr>";
        }
    } catch (e) { 
        console.error("Error Tabel 2:", e); 
    }
}

async function renderAdminSimpleTable(page = 1) {
    const table = document.getElementById("adminSimpleTable");
    if(!table) return;

    try {
        currentNotePage = page; 
        const res = await fetch(`${API_URL}/adminNotes?page=${page}`);
        const result = await res.json();

        const { data, pagination } = result;

        table.innerHTML = "";
        if (!data || data.length === 0) {
            table.innerHTML = "<tr><td colspan='4' align='center' style='color:#888'>Belum ada catatan di halaman ini</td></tr>";
            return;
        }

        data.forEach((area, i) => {
            const rowNumber = ((page - 1) * 10) + (i + 1);
            table.innerHTML += `
                <tr style="background-color: #f0fff4;">
                    <td>${rowNumber}</td>
                    <td><strong>${area.kecamatan}</strong></td>
                    <td>${area.kelurahan}</td>
                    <td>
                        <button onclick="deleteDBArea(${area.id})" style="color:red; cursor:pointer; border:none; background:none; font-weight:bold;">Hapus</button>
                    </td>
                </tr>`;
        });


        renderPaginationControls(pagination);
        
    } catch (e) { 
        console.error("Error Tabel 3:", e);
        table.innerHTML = "<tr><td colspan='4' align='center' style='color:red'>Gagal memuat data dari database</td></tr>";
    }
}


function renderPaginationControls(pagination) {
    const container = document.getElementById("notePagination");
    if (!container) return;

    container.innerHTML = `
    <div class="pagination-wrapper">
        <span class="pagination-info">Menampilkan hal. <b>${pagination.currentPage}</b> dari <b>${pagination.totalPages}</b></span>
        <div class="pagination-buttons">
            <button ${pagination.currentPage === 1 ? 'disabled' : ''} 
                onclick="renderAdminSimpleTable(${pagination.currentPage - 1})"
                class="btn-pagination">Prev</button>
            
            <button ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''} 
                onclick="renderAdminSimpleTable(${pagination.currentPage + 1})"
                class="btn-pagination">Next</button>
        </div>
    </div>
    `;
}

document.getElementById("addAreaForm").onsubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
        kecamatan: document.getElementById("kecamatan").value,
        kelurahan: document.getElementById("kelurahan").value
    };

    try {
        const res = await fetch(`${API_URL}/adminNotes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Tersimpan!',
                text: 'Area berhasil disimpan',
                timer: 2000,
                showConfirmButton: false
            });

            document.getElementById("addAreaForm").reset();
            closeAddAreaModal();
            renderAdminSimpleTable(1); 
        } else {
            throw new Error("Gagal simpan");
        }
    } catch (e) {
        Swal.fire('Error', 'Gagal menyimpan data.', 'error');
    }
};

async function deleteDBArea(id) {
    Swal.fire({
        title: 'Hapus Catatan?',
        text: "Data akan dihapus permanen.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/adminNotes/${id}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    Swal.fire({
                        title: 'Dihapus!',
                        icon: 'success',
                        timer: 1000,
                        showConfirmButton: false
                    });
                    renderAdminSimpleTable(currentNotePage); 
                }
            } catch (e) {
                Swal.fire('Error!', 'Gagal menghapus data dari server.', 'error');
            }
        }
    });
}

async function processAction(uid, action) {
    if (action === 'reject') {
        const { value: reason, isConfirmed } = await Swal.fire({
            title: 'Tolak Pendaftaran?',
            text: "Berikan alasan mengapa pendaftaran ini ditolak:",
            input: 'textarea',
            inputPlaceholder: 'Contoh: Area belum terjangkau kurir kami...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6e7881',
            confirmButtonText: 'Ya, Tolak!',
            cancelButtonText: 'Batal',
            inputValidator: (value) => {
                if (!value) {
                    return 'Alasan harus diisi agar user tahu kesalahannya!';
                }
            }
        });

        if (!isConfirmed) return;
        return executeApiCall(uid, action, reason);
    }

    Swal.fire({
        title: 'Konfirmasi Approve',
        text: `Apakah Anda yakin ingin menyetujui pendaftaran ini?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6e7881',
        confirmButtonText: 'Ya, Approve!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            executeApiCall(uid, action);
        }
    });
}

async function executeApiCall(uid, action, reason = "") {
    try {
        const res = await fetch(`${API_URL}/areaRequests/${uid.trim()}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: action, 
                alsoRegister: action === 'approve',
                reason: reason 
            })
        });

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: `Pendaftaran berhasil di-${action}.`,
                timer: 1500,
                showConfirmButton: false
            });
            loadPending();    
            loadRegistered(); 
        } else {
            Swal.fire('Gagal!', 'Terjadi kesalahan pada server.', 'error');
        }
    } catch (e) { 
        Swal.fire('Error!', 'Gagal menghubungi server.', 'error');
    }
}
function openAddAreaModal() { document.getElementById("addAreaModal").classList.add("active"); }
function closeAddAreaModal() { document.getElementById("addAreaModal").classList.remove("active"); }