const API_SCHEDULE = "http://localhost:3000/api/schedule";
const API_AREA = "http://localhost:3000/api/areaAdm";
let schedules = [];

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalTambah");
    const btnTambah = document.getElementById("btnTambah");
    const btnClose = document.getElementById("btnClose");
    const btnBatal = document.getElementById("btnBatal");
    const form = document.getElementById("formSchedule");
    const alamatSelect = document.getElementById("alamat");

    // 1. Fungsi Load Data Area dengan Proteksi Ganda
    async function loadAreas() {
        try {
            // Berikan indikator loading sementara
            alamatSelect.innerHTML = '<option value="" disabled selected>Memuat area...</option>';
            
            const res = await fetch(API_AREA);
            if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
            
            const json = await res.json();
            const areas = Array.isArray(json) ? json : (json.data || []);
            
            alamatSelect.innerHTML = '<option value="" disabled selected>Pilih Area Penjemputan</option>';
            
            if (areas.length === 0) {
                alamatSelect.innerHTML = '<option value="">Tidak ada data area tersedia</option>';
                return;
            }

            areas.forEach(area => {
                const option = document.createElement("option");
                // Menangani kemungkinan nama properti yang berbeda di DB (nama_area atau alamat)
                const val = area.nama_area || area.alamat || area.nama; 
                if (val) {
                    option.value = val;
                    option.textContent = val;
                    alamatSelect.appendChild(option);
                }
            });
        } catch (err) {
            console.error("Gagal memuat area:", err);
            alamatSelect.innerHTML = '<option value="">Gagal memuat data area</option>';
        }
    }

    // Modal Control - Tambah
    btnTambah.onclick = async () => {
        document.getElementById("modalTitle").innerText = "Tambah Jadwal Baru";
        form.reset();
        document.getElementById("scheduleId").value = "";
        document.getElementById("statusContainer").style.display = "none";
        
        await loadAreas(); 
        modal.style.display = "flex";
    };

    const hideModal = () => {
        modal.style.display = "none";
        form.reset(); // Bersihkan form saat tutup
    };

    btnClose.onclick = hideModal;
    btnBatal.onclick = hideModal;

    // Load Tabel
    async function loadSchedules() {
        const tbody = document.getElementById("tableBody");
        if (!tbody) return;

        try {
            const res = await fetch(API_SCHEDULE);
            const json = await res.json();
            schedules = Array.isArray(json) ? json : (json.data || []);
            tbody.innerHTML = "";

            schedules.forEach((item, i) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${i + 1}</td>
                    <td><strong>${item.courier_name}</strong></td>
                    <td style="text-align: left;">${item.alamat}</td>
                    <td>${item.date}</td>
                    <td><div class="time-box-ui">${item.time}</div></td>
                    <td><span class="badge-yellow">${(item.status || 'tersedia').toUpperCase()}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="editData('${item.id}')" class="btn-action btn-edit-icon">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button onclick="deleteData('${item.id}')" class="btn-action btn-delete-icon">
                                <i class="bi bi-trash"></i> Hapus
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (err) { 
            console.error("Error load table:", err);
            tbody.innerHTML = '<tr><td colspan="7">Gagal memuat data antrean.</td></tr>';
        }
    }

    loadSchedules();

    // Submit Form (Tambah & Update)
    form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById("scheduleId").value;
        
        const payload = {
            courier_name: document.getElementById("courier_name").value,
            alamat: alamatSelect.value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            status: document.getElementById("status").value || "tersedia"
        };

        const method = id ? "PUT" : "POST";
        const url = id ? `${API_SCHEDULE}/${id}` : API_SCHEDULE;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                hideModal();
                loadSchedules();
            } else {
                alert("Gagal menyimpan data!");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Fungsi Edit (Global Window)
    window.editData = async (id) => {
        // Menggunakan loose equality (==) untuk mengantisipasi perbedaan tipe string/number
        const item = schedules.find(s => s.id == id);
        if (!item) return;
        
        document.getElementById("modalTitle").innerText = "Edit Jadwal";
        document.getElementById("scheduleId").value = item.id;
        document.getElementById("courier_name").value = item.courier_name;
        
        // Muat area dulu, baru set nilainya agar select tidak balik ke default
        await loadAreas(); 
        alamatSelect.value = item.alamat;
        
        document.getElementById("date").value = item.date;
        document.getElementById("time").value = item.time;
        document.getElementById("statusContainer").style.display = "block";
        document.getElementById("status").value = item.status || "tersedia";
        
        modal.style.display = "flex";
    };

    // Fungsi Delete (Global Window)
    window.deleteData = async (id) => {
        if (confirm("Hapus data jadwal ini?")) {
            try {
                const res = await fetch(`${API_SCHEDULE}/${id}`, { method: "DELETE" });
                if (res.ok) loadSchedules();
            } catch (err) {
                console.error("Gagal menghapus:", err);
            }
        }
    };
});