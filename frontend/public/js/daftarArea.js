const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    loadPending();      // Tabel 1 (Database: areaRequests)
    loadRegistered();   // Tabel 2 (Database: areaMaster)
    renderAdminSimpleTable(); // Tabel 3 (Database: adminNotes)
});

// TABEL 1: Menunggu Persetujuan
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

// TABEL 2: Area Terdaftar (Riwayat Resmi)
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
                        <td>${item.jalan}</td>
                        <td>${item.kecamatan}</td>
                        <td>${item.kota}</td>
                        <td>${item.kelurahan}</td>
                        <td>${item.provinsi}</td>
                        <td><span class="status-text accepted">Registered</span></td>
                    </tr>`;
            });
        }
    } catch (e) { console.error("Error Tabel 2:", e); }
}


async function renderAdminSimpleTable() {
    const table = document.getElementById("adminSimpleTable");
    if(!table) return;

    try {
        // Ambil data dari endpoint API baru
        const res = await fetch(`${API_URL}/adminNotes`);
        const data = await res.json();

        table.innerHTML = "";
        if (!data || data.length === 0) {
            table.innerHTML = "<tr><td colspan='4' align='center' style='color:#888'>Belum ada area ditambahkan ke database</td></tr>";
            return;
        }

        data.forEach((area, i) => {
            table.innerHTML += `
                <tr style="background-color: #f0fff4;">
                    <td>${i + 1}</td>
                    <td><strong>${area.kecamatan}</strong></td>
                    <td>${area.kelurahan}</td>
                    <td>
                        <button onclick="deleteDBArea(${area.id})" style="color:red; cursor:pointer; border:none; background:none; font-weight:bold;">Hapus</button>
                    </td>
                </tr>`;
        });
    } catch (e) { 
        console.error("Error Tabel 3:", e);
        table.innerHTML = "<tr><td colspan='4' align='center' style='color:red'>Gagal memuat data dari database</td></tr>";
    }
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
                text: 'Area berhasil disimpan ke Database MySQL.',
                timer: 2000,
                showConfirmButton: false
            });

            document.getElementById("addAreaForm").reset();
            closeAddAreaModal();
            renderAdminSimpleTable(); // Refresh tabel 3
        } else {
            throw new Error("Gagal simpan");
        }
    } catch (e) {
        Swal.fire('Error', 'Gagal menyimpan ke database.', 'error');
    }
};

async function deleteDBArea(id) {
    Swal.fire({
        title: 'Hapus Catatan?',
        text: "Data akan dihapus permanen dari Database MySQL.",
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
                    renderAdminSimpleTable(); // Refresh tabel 3
                }
            } catch (e) {
                Swal.fire('Error!', 'Gagal menghapus data dari server.', 'error');
            }
        }
    });
}

async function processAction(uid, action) {
    const actionText = action === 'approve' ? 'menyetujui' : 'menolak';
    const actionColor = action === 'approve' ? '#28a745' : '#dc3545';

    Swal.fire({
        title: 'Konfirmasi Tindakan',
        text: `Apakah Anda yakin ingin ${actionText} pendaftaran ini?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: actionColor,
        cancelButtonColor: '#6e7881',
        confirmButtonText: action === 'approve' ? 'Ya, Approve!' : 'Ya, Reject!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/areaRequests/${uid.trim()}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: action, alsoRegister: true })
                });

                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: `Status pendaftaran berhasil di-${action}.`,
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
    });
}

function openAddAreaModal() { document.getElementById("addAreaModal").classList.add("active"); }
function closeAddAreaModal() { document.getElementById("addAreaModal").classList.remove("active"); }