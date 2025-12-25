document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading-overlay");

    /* =====================
        API
    ====================== */
    const API_SCHEDULE = "http://localhost:3000/api/schedule";
    const API_KEUNTUNGAN = "http://localhost:3000/api/keuntungan";

    const scheduleBody = document.getElementById("tableBody");
    const pendingBody = document.getElementById("pending-body");

    let schedules = [];

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

    /* =====================
        SCHEDULE
    ====================== */
    async function loadSchedules() {
        if (!scheduleBody) return;

        try {
            showLoading();
            const res = await fetch(API_SCHEDULE);
            const json = await res.json();

            schedules = Array.isArray(json) ? json : (json.data || []);
            renderSchedules(schedules);
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

            const data = Array.isArray(response.data)
                ? response.data
                : response;

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
        GLOBAL FUNCTIONS
    ====================== */
    window.editData = (id) => {
        console.log("Edit schedule ID:", id);
        // logic edit modal tetap pakai kode jadwal milikmu
    };

    window.deleteData = async (id) => {
        if (confirm("Hapus jadwal ini?")) {
            try {
                const res = await fetch(`${API_SCHEDULE}/${id}`, {
                    method: "DELETE"
                });
                if (res.ok) loadSchedules();
            } catch (err) {
                console.error("Gagal hapus jadwal", err);
            }
        }
    };
});
