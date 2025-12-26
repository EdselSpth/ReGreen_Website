const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    loadPending();      // Tabel 1
    loadRegistered();   // Tabel 2
    renderAdminSimpleTable(); // Tabel 3
});

async function loadPending() {
    try {
        const res = await fetch(`${API_URL}/areaRequests?status=pending`);
        const result = await res.json();
        const table = document.getElementById("pendingAreaTable");
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


function renderAdminSimpleTable() {
    const table = document.getElementById("adminSimpleTable");
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
                    <button onclick="deleteLocalArea(${i})" style="color:red; cursor:pointer; border:none; background:none;">Hapus</button>
                </td>
            </tr>`;
    });
}


document.getElementById("addAreaForm").onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
        kecamatan: document.getElementById("kecamatan").value,
        kelurahan: document.getElementById("kelurahan").value,
        kota: document.getElementById("kota").value,
        provinsi: document.getElementById("provinsi").value,
        jalan: document.getElementById("jalan").value,
    };

    const res = await fetch(`${API_URL}/areaMaster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        
        let savedAreas = JSON.parse(localStorage.getItem("admin_areas_simple") || "[]");
        savedAreas.unshift(payload);
        localStorage.setItem("admin_areas_simple", JSON.stringify(savedAreas));

        alert("Berhasil Menambahkan Area!");
        closeAddAreaModal();
        renderAdminSimpleTable(); // Update Tabel 3
        
    }
};


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
            loadRegistered(); 
        }
    } catch (e) { alert("Gagal proses data"); }
}

function deleteLocalArea(index) {
    let savedAreas = JSON.parse(localStorage.getItem("admin_areas_simple") || "[]");
    savedAreas.splice(index, 1);
    localStorage.setItem("admin_areas_simple", JSON.stringify(savedAreas));
    renderAdminSimpleTable();
}


function openAddAreaModal() { document.getElementById("addAreaModal").classList.add("active"); }
function closeAddAreaModal() { document.getElementById("addAreaModal").classList.remove("active"); }