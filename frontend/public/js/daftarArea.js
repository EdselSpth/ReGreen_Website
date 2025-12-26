const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    loadPending();      // Tabel 1 (Dari Database)
    loadRegistered();   // Tabel 2 (Dari Database)
    renderAdminSimpleTable(); // Tabel 3 (Hanya LocalStorage)
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

// TABEL 2: Riwayat Seluruh Area (Database Murni)
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

// TABEL 3: Catatan Admin (Hanya di Browser)
function renderAdminSimpleTable() {
    const table = document.getElementById("adminSimpleTable");
    if(!table) return;
    const savedAreas = JSON.parse(localStorage.getItem("admin_areas_simple") || "[]");

    table.innerHTML = "";
    if (savedAreas.length === 0) {
        table.innerHTML = "<tr><td colspan='4' align='center' style='color:#888'>Belum ada area ditambahkan manual</td></tr>";
        return;
    }

    savedAreas.forEach((area, i) => {
        table.innerHTML += `
            <tr style="background-color: #f0fff4;">
                <td>${i + 1}</td>
                <td><strong>${area.kecamatan}</strong></td>
                <td>${area.kelurahan}</td>
                <td>
                    <button onclick="deleteLocalArea(${i})" style="color:red; cursor:pointer; border:none; background:none; font-weight:bold;">Hapus</button>
                </td>
            </tr>`;
    });
}

// LOGIKA SIMPAN: Sekarang HANYA ke LocalStorage agar Tabel 2 tidak terisi data admin
document.getElementById("addAreaForm").onsubmit = (e) => {
    e.preventDefault();
    
    // Ambil data input
    const payload = {
        kecamatan: document.getElementById("kecamatan").value,
        kelurahan: document.getElementById("kelurahan").value
    };

    // Simpan ke LocalStorage
    let savedAreas = JSON.parse(localStorage.getItem("admin_areas_simple") || "[]");
    savedAreas.unshift(payload);
    localStorage.setItem("admin_areas_simple", JSON.stringify(savedAreas));

    alert("Berhasil disimpan ke Catatan Admin!");
    
    // Reset dan Tutup
    document.getElementById("addAreaForm").reset();
    closeAddAreaModal();
    
    // Render Tabel 3 saja
    renderAdminSimpleTable(); 
    
    // CATATAN: loadRegistered() sengaja tidak dipanggil agar Tabel 2 tetap bersih dari data ini.
};

// PROSES APPROVE / REJECT
async function processAction(uid, action) {
    if (!confirm(`Yakin ingin ${action}?`)) return;
    try {
        const res = await fetch(`${API_URL}/areaRequests/${uid.trim()}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: action, alsoRegister: true })
        });
        if (res.ok) {
            alert("Status diperbarui!");
            loadPending();    
            loadRegistered(); // Tabel 2 update jika ada data dari User yang di-approve
        }
    } catch (e) { alert("Gagal proses data"); }
}

function deleteLocalArea(index) {
    if(!confirm("Hapus catatan ini?")) return;
    let savedAreas = JSON.parse(localStorage.getItem("admin_areas_simple") || "[]");
    savedAreas.splice(index, 1);
    localStorage.setItem("admin_areas_simple", JSON.stringify(savedAreas));
    renderAdminSimpleTable();
}

// MODAL CONTROLLER
function openAddAreaModal() { document.getElementById("addAreaModal").classList.add("active"); }
function closeAddAreaModal() { document.getElementById("addAreaModal").classList.remove("active"); }