const API_SCHEDULE = "http://localhost:3000/api/schedule";
const API_AREA = "http://localhost:3000/api/areaMaster";


let schedules = [];
let currentPage = 1;
let totalPage = 1;
let searchKeyword = "";
const LIMIT = 5;

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalTambah");
    const btnTambah = document.getElementById("btnTambah");
    const btnClose = document.getElementById("btnClose");
    const btnBatal = document.getElementById("btnBatal");
    const form = document.getElementById("formSchedule");

    const alamatInput = document.getElementById("alamat");
    const alamatList = document.getElementById("alamatList");
    const searchInput = document.getElementById("searchInput");
    const paginationEl = document.getElementById("pagination");


    async function loadAreas() {
        alamatList.innerHTML = "";
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

    //modal
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

    //load schedule untuk pagination
    async function loadSchedules() {
        const tbody = document.getElementById("tableBody");
        if (!tbody) return;

        try {
            const url = `${API_SCHEDULE}?page=${currentPage}&limit=${LIMIT}&search=${searchKeyword}`;
            const res = await fetch(url);
            const json = await res.json();

            schedules = json.data || [];
            totalPage = json.pagination?.totalPage || 1;

            tbody.innerHTML = "";

            if (schedules.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7">Tidak ada data</td></tr>`;
                paginationEl.innerHTML = "";
                return;
            }

            schedules.forEach((item, i) => {
                tbody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>${(currentPage - 1) * LIMIT + i + 1}</td>
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

            renderPagination();
        } catch (err) {
            console.error("Load schedule error:", err);
        }
    }

    //pagination
    function renderPagination() {
        paginationEl.innerHTML = "";

        const createBtn = (label, page, disabled = false, active = false) => `
            <li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
                <a class="page-link" href="#" onclick="changePage(${page})">${label}</a>
            </li>
        `;

        paginationEl.insertAdjacentHTML(
            "beforeend",
            createBtn("Prev", currentPage - 1, currentPage === 1)
        );

        for (let i = 1; i <= totalPage; i++) {
            paginationEl.insertAdjacentHTML(
                "beforeend",
                createBtn(i, i, false, i === currentPage)
            );
        }

        paginationEl.insertAdjacentHTML(
            "beforeend",
            createBtn("Next", currentPage + 1, currentPage === totalPage)
        );
    }

    window.changePage = function (page) {
        if (page < 1 || page > totalPage) return;
        currentPage = page;
        loadSchedules();
    };

    //search
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchKeyword = e.target.value.trim();
            currentPage = 1;
            loadSchedules();
        }
    });


    //submit
    let isSubmitting = false;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
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

            if (!res.ok) {
                alert("Gagal menyimpan data");
                return;
            }

            hideModal();
            loadSchedules();
        } catch (err) {
            console.error(err);
        } finally {
            isSubmitting = false;
        }
    });


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

    window.deleteData = async (id) => {
        if (!confirm("Hapus jadwal ini?")) return;
        await fetch(`${API_SCHEDULE}/${id}`, { method: "DELETE" });
        loadSchedules();
    };


    loadSchedules();
});
