document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading-overlay");

    /* =====================
        API ENDPOINTS
    ====================== */
    const API_SCHEDULE = "http://localhost:3000/api/schedule";
    const API_KEUNTUNGAN = "http://localhost:3000/api/keuntungan";
    // Memastikan menggunakan endpoint pending area
    const API_PENDING_AREA = "http://localhost:3000/api/areaRequests?status=pending"; 

    const scheduleBody = document.getElementById("tableBody");
    const pendingBody = document.getElementById("pending-body");
    const areaBody = document.getElementById("pendingAreaTable");

    function showLoading() {
        loading?.classList.add("active");
    }

    function hideLoading() {
        loading?.classList.remove("active");
    }

    /* =====================
        INITIAL LOAD
    ====================== */
    loadSchedules();
    loadPending();
    loadAreas();

    /* =====================
        1. SCHEDULE (JADWAL)
    ====================== */
    async function loadSchedules() {
        if (!scheduleBody) return;
        try {
            showLoading();
            const res = await fetch(API_SCHEDULE);
            const json = await res.json();

            // Konsisten mengecek properti .data
            const data = json.data || (Array.isArray(json) ? json : []);
            renderSchedules(data);
        } catch (err) {
            console.error("Gagal load schedule", err);
            scheduleBody.innerHTML = `<tr><td colspan="7" align="center">Gagal memuat data jadwal</td></tr>`;
        } finally {
            hideLoading();
        }
    }

    function renderSchedules(data) {
        scheduleBody.innerHTML = "";
        if (!data || data.length === 0) {
            scheduleBody.innerHTML = `<tr><td colspan="7" align="center">Tidak ada data jadwal</td></tr>`;
            return;
        }

        data.forEach((item, i) => {
            scheduleBody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td><strong>${item.courier_name}</strong></td>
                    <td style="text-align:left">${item.alamat}</td>
                    <td>${item.date}</td>
                    <td><div class="time-box-ui">${item.time}</div></td>
                    <td><span class="badge-yellow">${(item.status || "tersedia").toUpperCase()}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="editData('${item.id}')" class="btn-action btn-edit-icon"><i class="bi bi-pencil"></i> Edit</button>
                            <button onclick="deleteData('${item.id}')" class="btn-action btn-delete-icon"><i class="bi bi-trash"></i> Hapus</button>
                        </div>
                    </td>
                </tr>`;
        });
    }

    /* =====================
        2. KEUNTUNGAN
    ====================== */
    async function loadPending() {
        if (!pendingBody) return;
        try {
            const res = await fetch(API_KEUNTUNGAN);
            const json = await res.json();
            const data = json.data || (Array.isArray(json) ? json : []);
            renderPending(data);
        } catch (err) {
            console.error("Gagal load keuntungan", err);
        }
    }

    function renderPending(data) {
        pendingBody.innerHTML = "";
        if (!data || data.length === 0) {
            pendingBody.innerHTML = `<tr><td colspan="5" align="center">Tidak ada data keuntungan</td></tr>`;
            return;
        }

        data.slice(0, 5).forEach((item, i) => {
            pendingBody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.nama_pengguna}</td>
                    <td>Rp ${item.nominal.toLocaleString("id-ID")}</td>
                    <td>${item.metode}</td>
                    <td>${item.rekening}</td>
                </tr>`;
        });
    }

    /* =====================
        3. PENDING AREA (MENUNGGU PERSETUJUAN)
    ====================== */
    async function loadAreas() {
        if (!areaBody) return; 

        try {
            const res = await fetch(API_PENDING_AREA);
            const json = await res.json();
            const data = json.data || (Array.isArray(json) ? json : []);

            areaBody.innerHTML = "";
            if (data.length === 0) {
                areaBody.innerHTML = `<tr><td colspan="7" align="center">Tidak ada area menunggu persetujuan</td></tr>`;
                return;
            }

            data.slice(0, 5).forEach((item, i) => {
                // Mengambil data alamat dari nested object 'area'
                const areaInfo = item.area || {}; 
                
                areaBody.innerHTML += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${areaInfo.jalan || "-"}</td>
                        <td>${areaInfo.kecamatan || "-"}</td>
                        <td>${areaInfo.kota || "-"}</td>
                        <td>${areaInfo.kelurahan || "-"}</td>
                        <td>${areaInfo.provinsi || "-"}</td>
                        <td><span class="badge-yellow">PENDING</span></td>
                    </tr>`;
            });
        } catch (err) {
            console.error("Gagal load area di dashboard", err);
            areaBody.innerHTML = `<tr><td colspan="7" align="center" style="color:red;">Gagal memuat data</td></tr>`;
        }
    }

    /* =====================
        GLOBAL FUNCTIONS
    ====================== */
    window.editData = (id) => {
        console.log("Edit schedule ID:", id);
    };

    window.deleteData = async (id) => {
        if (confirm("Hapus jadwal ini?")) {
            try {
                const res = await fetch(`${API_SCHEDULE}/${id}`, { method: "DELETE" });
                if (res.ok) loadSchedules();
            } catch (err) {
                console.error("Gagal hapus jadwal", err);
            }
        }
    };
});