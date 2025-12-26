document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading-overlay");

    /* =====================
        API
    ====================== */
    const API_SCHEDULE = "http://localhost:3000/api/schedule";
    const API_KEUNTUNGAN = "http://localhost:3000/api/keuntungan";
    const API_AREA = "http://localhost:3000/api/areaMaster"; // Endpoint area

    const scheduleBody = document.getElementById("schedule-body");
    const pendingBody = document.getElementById("pending-body");
    const areaBody = document.getElementById("area-body"); // <tbody> untuk daftar area

    function showLoading() {
        loading?.classList.add("active");
    }

    function hideLoading() {
        loading?.classList.remove("active");
    }

    /* =====================
        LOAD DATA
    ====================== */
    loadSchedules();
    loadPending();
    loadAreas(); // Load area saat halaman siap

    /* =====================
        SCHEDULE
    ====================== */
    async function loadSchedules() {
        if (!scheduleBody) return;

        try {
            showLoading();
            const res = await fetch(API_SCHEDULE);
            const json = await res.json();

            const data = Array.isArray(json) ? json : (json.data || []);
            renderSchedules(data);
        } catch (err) {
            console.error("Gagal load schedule", err);
            scheduleBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center">
                        Gagal memuat data jadwal
                    </td>
                </tr>
            `;
        } finally {
            hideLoading();
        }
    }

    function renderSchedules(data) {
        scheduleBody.innerHTML = "";

        if (!data || data.length === 0) {
            scheduleBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center">
                        Tidak ada data jadwal
                    </td>
                </tr>
            `;
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
                    <td>
                        <span class="badge-yellow">
                            ${(item.status || "tersedia").toUpperCase()}
                        </span>
                    </td>
                </tr>
            `;
        });
    }

    /* =====================
        KEUNTUNGAN (PENDING)
    ====================== */
    async function loadPending() {
        try {
            const res = await fetch(API_KEUNTUNGAN);
            const response = await res.json();
            const data = Array.isArray(response.data) ? response.data : response;
            renderPending(data);
        } catch (err) {
            console.error("Gagal load keuntungan", err);
        }
    }

    function renderPending(data) {
        pendingBody.innerHTML = "";

        if (!data || data.length === 0) {
            pendingBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center">
                        Tidak ada data keuntungan
                    </td>
                </tr>
            `;
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
                </tr>
            `;
        });
    }

    /* =====================
        AREA
    ====================== */
    async function loadAreas() {
        if (!areaBody) return;

        try {
            showLoading();
            const res = await fetch(API_AREA);
            const data = await res.json();

            areaBody.innerHTML = "";
            if (!data || data.length === 0) {
                areaBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center">
                            Tidak ada area terdaftar
                        </td>
                    </tr>
                `;
                return;
            }

            data.forEach((item, i) => {
                areaBody.innerHTML += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${item.jalan}</td>
                        <td>${item.kelurahan}</td>
                        <td>${item.kecamatan}</td>
                        <td>${item.kota}</td>
                        <td>${item.provinsi}</td>
                    </tr>
                `;
            });
        } catch (err) {
            console.error("Gagal load area", err);
        } finally {
            hideLoading();
        }
    }

    /* =====================
        GLOBAL FUNCTIONS
    ====================== */
    window.editData = (id) => {
        console.log("Edit schedule ID:", id);
        // logic edit modal tetap pakai kode jadwal
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
