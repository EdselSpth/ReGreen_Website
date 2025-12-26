const API_SCHEDULE = "http://localhost:3000/api/schedule";
const API_AREA = "http://localhost:3000/api/areaMaster";

let schedules = [];

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalTambah");
    const btnTambah = document.getElementById("btnTambah");
    const btnClose = document.getElementById("btnClose");
    const btnBatal = document.getElementById("btnBatal");
    const form = document.getElementById("formSchedule");

    const alamatInput = document.getElementById("alamat");
    const alamatList = document.getElementById("alamatList");

    /* =======================
       LOAD AREA (DATALIST)
    ======================= */
    async function loadAreas() {
        alamatList.innerHTML = "";
        alamatInput.disabled = false;
        alamatInput.readOnly = false;

        try {
            const res = await fetch(API_AREA);
            if (!res.ok) throw new Error("Gagal mengambil area");

            const json = await res.json();
            const areas = Array.isArray(json) ? json : (json.data || []);

            areas.forEach(a => {
                if (a.jalan && a.kelurahan && a.kecamatan && a.kota && a.provinsi) {
                    const opt = document.createElement("option");
                    opt.value = `${a.jalan}, ${a.kelurahan}, ${a.kecamatan}, ${a.kota}, ${a.provinsi}`;
                    alamatList.appendChild(opt);
                }
            });
        } catch (err) {
            console.error("Load area error:", err);
        }
    }

    /* =======================
       MODAL CONTROL
    ======================= */
    btnTambah.addEventListener("click", async () => {
        form.reset();
        document.getElementById("modalTitle").innerText = "Tambah Jadwal";
        document.getElementById("scheduleId").value = "";
        document.getElementById("statusContainer").style.display = "none";

        await loadAreas();
        modal.style.display = "flex";
    });

    function hideModal() {
        modal.style.display = "none";
        form.reset();
    }

    btnClose.onclick = hideModal;
    btnBatal.onclick = hideModal;

    /* =======================
       LOAD TABLE
    ======================= */
    async function loadSchedules() {
        const tbody = document.getElementById("tableBody");
        if (!tbody) return;

        try {
            const res = await fetch(API_SCHEDULE);
            const json = await res.json();
            schedules = Array.isArray(json) ? json : (json.data || []);

            tbody.innerHTML = "";

            if (schedules.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7">Tidak ada data</td></tr>`;
                return;
            }

            schedules.forEach((item, i) => {
                tbody.insertAdjacentHTML("beforeend", `
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
                            <button class="btn-action btn-edit-icon" onclick="editData('${item.id}')">Edit</button>
                            <button class="btn-action btn-delete-icon" onclick="deleteData('${item.id}')">Hapus</button>
                        </td>
                    </tr>
                `);
            });
        } catch (err) {
            console.error("Load schedule error:", err);
        }
    }

    loadSchedules();

    /* =======================
       SUBMIT (TAMBAH & EDIT)
    ======================= */
    let isSubmitting = false;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // 🔒 ANTI DUPLIKAT
        isSubmitting = true;

        const id = document.getElementById("scheduleId").value;

        const payload = {
            firebase_uid: "ADMIN_MANUAL",
            courier_name: document.getElementById("courier_name").value.trim(),
            alamat: alamatInput.value.trim(),
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            waste_type: "campuran",
            status: document.getElementById("status")?.value || "tersedia"
        };

        if (!payload.courier_name || !payload.alamat || !payload.date || !payload.time) {
            alert("Semua field wajib diisi");
            isSubmitting = false;
            return;
        }

        const url = id ? `${API_SCHEDULE}/${id}` : API_SCHEDULE;
        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const text = await res.text();
            console.log("STATUS:", res.status);
            console.log("RESPONSE:", text);

            if (!res.ok) {
                alert("Gagal menyimpan data");
                return;
            }

            hideModal();
            loadSchedules();
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan");
        } finally {
            isSubmitting = false; // 🔓 buka lagi
        }
    });


    /* =======================
       EDIT DATA
    ======================= */
    window.editData = async (id) => {
        const item = schedules.find(s => s.id == id);
        if (!item) return;

        await loadAreas();

        document.getElementById("modalTitle").innerText = "Edit Jadwal";
        document.getElementById("scheduleId").value = item.id;
        document.getElementById("courier_name").value = item.courier_name;
        alamatInput.value = item.alamat;
        document.getElementById("date").value = item.date;
        document.getElementById("time").value = item.time;

        document.getElementById("statusContainer").style.display = "block";
        document.getElementById("status").value = item.status || "tersedia";

        modal.style.display = "flex";
    };

    /* =======================
       DELETE DATA
    ======================= */
    window.deleteData = async (id) => {
        if (!confirm("Hapus jadwal ini?")) return;

        try {
            await fetch(`${API_SCHEDULE}/${id}`, { method: "DELETE" });
            loadSchedules();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };
});
