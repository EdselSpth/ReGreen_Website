const API_SCHEDULE = "http://localhost:3000/api/schedule";
const API_AREA = "http://localhost:3000/api/areaMaster";
const API_JENIS_SAMPAH = "http://localhost:3000/api/jenisSampah";

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

    const searchInput = document.getElementById("searchInput");
    const paginationEl = document.getElementById("pagination");


    function isDuplicateSchedule(payload, currentId = null) {
        return schedules.some(item =>
            item.alamat === payload.alamat &&
            item.date === payload.date &&
            item.time === payload.time &&
            item.waste_type === payload.waste_type &&
            String(item.id) !== String(currentId)
        );
    }

    async function loadAreas(selected = "") {
        const select = document.getElementById("alamat");
        select.innerHTML = `<option value="">-- Pilih Alamat --</option>`;

        const res = await fetch(API_AREA);
        const json = await res.json();
        const areas = Array.isArray(json) ? json : json.data || [];

        areas.forEach(item => {
            const alamat = `${item.jalan}, ${item.kelurahan}, ${item.kecamatan}, ${item.kota}, ${item.provinsi}`;
            const opt = document.createElement("option");
            opt.value = alamat;
            opt.textContent = alamat;
            if (alamat === selected) opt.selected = true;
            select.appendChild(opt);
        });
    }

    async function loadJenisSampah(selected = "") {
        const select = document.getElementById("waste_type");
        select.innerHTML = `<option value="">-- Pilih Jenis Sampah --</option>`;

        const res = await fetch(API_JENIS_SAMPAH);
        const json = await res.json();
        const data = json.data?.data || [];

        data.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.nama_jenis;
            opt.textContent = item.nama_jenis.toUpperCase();
            if (item.nama_jenis === selected) opt.selected = true;
            select.appendChild(opt);
        });
    }

    btnTambah.onclick = async () => {
        form.reset();
        document.getElementById("modalTitle").innerText = "Tambah Jadwal";
        document.getElementById("scheduleId").value = "";
        document.getElementById("statusContainer").style.display = "none";

        await loadAreas();
        await loadJenisSampah();

        modal.style.display = "flex";
    };

    function hideModal() {
        modal.style.display = "none";
        form.reset();
    }

    btnClose.onclick = hideModal;
    btnBatal.onclick = hideModal;

    async function loadSchedules() {
        const tbody = document.getElementById("tableBody");
        const res = await fetch(`${API_SCHEDULE}?page=${currentPage}&limit=${LIMIT}&search=${searchKeyword}`);
        const json = await res.json();

        schedules = json.data || [];
        totalPage = json.pagination?.totalPage || 1;
        tbody.innerHTML = "";

        if (!schedules.length) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center">Tidak ada data</td></tr>`;
            paginationEl.innerHTML = "";
            return;
        }

        schedules.forEach((item, i) => {
            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${(currentPage - 1) * LIMIT + i + 1}</td>
                    <td><strong>${item.courier_name}</strong></td>
                    <td>${item.alamat}</td>
                    <td><span class="badge-green">${item.waste_type.toUpperCase()}</span></td>
                    <td>${item.date}</td>
                    <td>${item.time}</td>
                    <td><span class="badge-yellow">${item.status}</span></td>
                    <td>
                        <button class="btn-action btn-edit-icon" onclick="editData('${item.id}')">Edit</button>
                        <button class="btn-action btn-delete-icon" onclick="deleteData('${item.id}')">Hapus</button>
                    </td>
                </tr>
            `);
        });

        renderPagination();
    }

function renderPagination() {
    paginationEl.innerHTML = "";

    const prevLi = document.createElement("li");
    prevLi.classList.add("page-item");
    if (currentPage === 1) prevLi.classList.add("disabled");

    const prevA = document.createElement("a");
    prevA.href = "#";
    prevA.textContent = "Prev";

    prevA.addEventListener("click", e => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadSchedules();
        }
    });

    prevLi.appendChild(prevA);
    paginationEl.appendChild(prevLi);

    //nomor
    for (let i = 1; i <= totalPage; i++) {
        const li = document.createElement("li");
        if (i === currentPage) li.classList.add("active");

        const a = document.createElement("a");
        a.href = "#";
        a.textContent = i;

        a.addEventListener("click", e => {
            e.preventDefault();
            if (currentPage !== i) {
                currentPage = i;
                loadSchedules();
            }
        });

        li.appendChild(a);
        paginationEl.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.classList.add("page-item");
    if (currentPage === totalPage) nextLi.classList.add("disabled");

    const nextA = document.createElement("a");
    nextA.href = "#";
    nextA.textContent = "Next";

    nextA.addEventListener("click", e => {
        e.preventDefault();
        if (currentPage < totalPage) {
            currentPage++;
            loadSchedules();
        }
    });

    nextLi.appendChild(nextA);
    paginationEl.appendChild(nextLi);
}


    window.changePage = page => {
        currentPage = page;
        loadSchedules();
    };

    searchInput.onkeyup = e => {
        if (e.key === "Enter") {
            searchKeyword = e.target.value;
            currentPage = 1;
            loadSchedules();
        }
    };
    //form sybmit
    form.onsubmit = async e => {
        e.preventDefault();

        const id = document.getElementById("scheduleId").value;
        const timeStart = document.getElementById("time_start").value;
        const timeEnd = document.getElementById("time_end").value;

        if (!timeStart || !timeEnd) {
            Swal.fire("Error", "Waktu mulai & selesai wajib diisi", "warning");
            return;
        }

        const payload = {
            firebase_uid: "ADMIN_MANUAL",
            courier_name: document.getElementById("courier_name").value,
            alamat: document.getElementById("alamat").value,
            date: document.getElementById("date").value,
            time: `${timeStart} - ${timeEnd}`,
            waste_type: document.getElementById("waste_type").value,
            status: document.getElementById("status")?.value || "tersedia"
        };

        if (isDuplicateSchedule(payload, id)) {
            Swal.fire("Duplikasi", "Jadwal sudah ada", "warning");
            return;
        }

        const res = await fetch(id ? `${API_SCHEDULE}/${id}` : API_SCHEDULE, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            Swal.fire("Gagal", "Data gagal disimpan", "error");
            return;
        }

        hideModal();
        loadSchedules();
        Swal.fire("Berhasil", "Data tersimpan", "success");
    };
    //delete dan edit
    window.editData = async id => {
        const item = schedules.find(s => s.id == id);
        if (!item) return;

        await loadAreas(item.alamat);
        await loadJenisSampah(item.waste_type);

        const [start, end] = item.time.split(" - ");

        document.getElementById("modalTitle").innerText = "Edit Jadwal";
        document.getElementById("scheduleId").value = item.id;
        document.getElementById("courier_name").value = item.courier_name;
        document.getElementById("date").value = item.date;
        document.getElementById("time_start").value = start;
        document.getElementById("time_end").value = end;
        document.getElementById("statusContainer").style.display = "block";
        document.getElementById("status").value = item.status;

        modal.style.display = "flex";
    };

    window.deleteData = async id => {
        const confirm = await Swal.fire({
            title: "Hapus data?",
            icon: "warning",
            showCancelButton: true
        });

        if (!confirm.isConfirmed) return;

        await fetch(`${API_SCHEDULE}/${id}`, { method: "DELETE" });
        if (schedules.length === 1 && currentPage > 1) {
            currentPage--;
        }
        loadSchedules();
    };

    loadSchedules();
});
