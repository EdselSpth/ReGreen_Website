document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading-overlay");

    const showLoading = () => loading.classList.add("active");
    const hideLoading = () => loading.classList.remove("active");

    const API_URL = "http://localhost:3000/api/bankSampah";
    const API_JENIS = "http://localhost:3000/api/jenisSampah";

    const tableBody = document.getElementById("data-bank-body");
    const modalTambah = document.getElementById("modal-tambah");
    const modalEdit = document.getElementById("modal-edit");
    const formTambah = document.getElementById("form-tambah");
    const formEdit = document.getElementById("form-edit");
    const searchInput = document.getElementById("search-bank");
    const paginationEl = document.getElementById("pagination");
    const infoData = document.getElementById("info-data");

    let dataBank = [];
    let filteredData = [];
    let currentPage = 1;
    const rowsPerPage = 5;

    let tambahKategoriIds = [];
    let editKategoriIds = [];

    // --- 1. LOAD KATEGORI (Dropdown) ---
    async function loadKategori() {
        try {
            const res = await fetch(`${API_JENIS}?limit=100`);
            const responseJson = await res.json();
            // Sesuai struktur backend: responseJson.data.data
            const list = responseJson.data.data || [];

            const dropdowns = [
                { id: "tambah-kategori", list: list },
                { id: "edit-kategori", list: list },
            ];

            dropdowns.forEach((item) => {
                const select = document.getElementById(item.id);
                if (!select) return;
                select.innerHTML = `<option value="">-- Pilih Kategori --</option>`;
                item.list.forEach((j) => {
                    const opt = document.createElement("option");
                    opt.value = j.id;
                    opt.textContent = j.nama_jenis;
                    select.appendChild(opt);
                });
            });
        } catch (err) {
            console.error("Gagal load kategori:", err);
        }
    }

    // --- 2. TAGS SYSTEM ---
    function renderTags(containerId, selectedIds, source) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";

        selectedIds.forEach((id) => {
            // Cari text dari dropdown
            const selectEl = document.getElementById(`${source}-kategori`);
            const opt = Array.from(selectEl.options).find((o) => o.value == id);
            const text = opt ? opt.textContent : "Kategori " + id;

            const tag = document.createElement("div");
            tag.className = "tag";
            tag.innerHTML = `${text} <button type="button" data-id="${id}">&times;</button>`;

            tag.querySelector("button").onclick = () => {
                if (source === "tambah") {
                    tambahKategoriIds = tambahKategoriIds.filter(
                        (x) => x !== id
                    );
                    renderTags("tambah-selected", tambahKategoriIds, "tambah");
                } else {
                    editKategoriIds = editKategoriIds.filter((x) => x !== id);
                    renderTags("edit-selected", editKategoriIds, "edit");
                }
            };
            container.appendChild(tag);
        });
    }

    document
        .getElementById("tambah-kategori")
        .addEventListener("change", (e) => {
            const id = Number(e.target.value);
            if (!id || tambahKategoriIds.includes(id)) return;
            tambahKategoriIds.push(id);
            renderTags("tambah-selected", tambahKategoriIds, "tambah");
            e.target.value = "";
        });

    document.getElementById("edit-kategori").addEventListener("change", (e) => {
        const id = Number(e.target.value);
        if (!id || editKategoriIds.includes(id)) return;
        editKategoriIds.push(id);
        renderTags("edit-selected", editKategoriIds, "edit");
        e.target.value = "";
    });

    // --- 3. MAIN DATA ---
    async function loadData() {
        try {
            showLoading();
            const res = await fetch(API_URL);
            const result = await res.json();
            // Backend bankSampah ngirim array langsung
            dataBank = Array.isArray(result) ? result : [];
            filteredData = [...dataBank];
            renderTabel();
        } catch (err) {
            Swal.fire("Error", "Gagal memuat data", "error");
        } finally {
            hideLoading();
        }
    }

    function renderTabel() {
        tableBody.innerHTML = "";
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = filteredData.slice(start, end);

        if (pageData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Data Kosong</td></tr>`;
            return;
        }

        pageData.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.nama}</td>
                <td>${item.alamat}</td>
                <td>${item.kategori || "-"}</td>
                <td>
                    ${item.jam_buka ? item.jam_buka.substring(0, 5) : "-"} 
                    s/d 
                    ${item.jam_tutup ? item.jam_tutup.substring(0, 5) : "-"}
                </td>
                <td>${item.telepon || "-"}</td>
                <td><span class="badge ${
                    item.status === "Aktif" ? "badge-aktif" : "badge-nonaktif"
                }">${item.status}</span></td>
                <td>
                    <button class="btn-aksi btn-edit" data-id="${
                        item.id
                    }">Edit</button>
                    <button class="btn-aksi btn-hapus" data-id="${
                        item.id
                    }">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        renderPagination();
    }

    function renderPagination() {
        paginationEl.innerHTML = "";
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        infoData.innerText = `Menampilkan ${pageDataCount()} dari ${
            filteredData.length
        } data`;

        if (totalPages <= 1) return;
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.classList.toggle("active", i === currentPage);
            btn.onclick = () => {
                currentPage = i;
                renderTabel();
            };
            paginationEl.appendChild(btn);
        }
    }

    const pageDataCount = () =>
        Math.min(
            rowsPerPage,
            filteredData.length - (currentPage - 1) * rowsPerPage
        );

    // --- TOMBOL BUKA MODAL ---
    const tombolTambah = document.querySelector(".btn-tambah"); // Ambil tombol dari HTML

    if (tombolTambah) {
        tombolTambah.onclick = () => {
            // Reset form dan kategori sebelum buka
            formTambah.reset();
            tambahKategoriIds = [];
            document.getElementById("tambah-selected").innerHTML = "";
            modalTambah.classList.add("active");
        };
    }

    // --- 4. CRUD ACTIONS ---
    formTambah.onsubmit = async (e) => {
        e.preventDefault();

        const payload = {
            nama: document.getElementById("tambah-nama").value,
            alamat: document.getElementById("tambah-alamat").value,
            status: document.getElementById("tambah-status").value,
            jam_buka: document.getElementById("tambah-jam-buka").value || null,
            jam_tutup:
                document.getElementById("tambah-jam-tutup").value || null,
            telepon: document.getElementById("tambah-telepon").value,
            jenis_sampah_ids: tambahKategoriIds,
        };

        try {
            showLoading();

            // ✅ SIMPAN RESPONSE KE VARIABLE
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // ✅ CEK RESPONSE BENERAN
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            Swal.fire("Berhasil", "Data ditambahkan", "success");
            modalTambah.classList.remove("active");
            formTambah.reset();
            tambahKategoriIds = [];
            loadData();
        } catch (err) {
            console.error("CREATE ERROR:", err);
            Swal.fire("Gagal", "Error simpan data", "error");
        } finally {
            hideLoading();
        }
    };

    tableBody.onclick = async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("btn-hapus")) {
            const confirm = await Swal.fire({
                title: "Hapus data?",
                showCancelButton: true,
                confirmButtonText: "Ya, Hapus",
            });
            if (confirm.isConfirmed) {
                await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                loadData();
            }
        }

        if (e.target.classList.contains("btn-edit")) {
            const item = dataBank.find((b) => b.id == id);
            if (item) {
                document.getElementById("edit-index").value = item.id;
                document.getElementById("edit-nama").value = item.nama;
                document.getElementById("edit-alamat").value = item.alamat;
                document.getElementById("edit-jam-buka").value =
                    item.jam_buka || "";
                document.getElementById("edit-jam-tutup").value =
                    item.jam_tutup || "";
                document.getElementById("edit-telepon").value =
                    item.telepon || "";
                document.getElementById("edit-status").value = item.status;

                editKategoriIds = item.kategori_ids || [];
                renderTags("edit-selected", editKategoriIds, "edit");
                modalEdit.classList.add("active");
            }
        }
    };

    formEdit.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-index").value;
        const payload = {
            nama: document.getElementById("edit-nama").value,
            alamat: document.getElementById("edit-alamat").value,
            status: document.getElementById("edit-status").value,
            jam_buka: document.getElementById("edit-jam-buka").value || null,
            jam_tutup: document.getElementById("edit-jam-tutup").value || null,
            telepon: document.getElementById("edit-telepon").value,
            jenis_sampah_ids: editKategoriIds,
        };

        try {
            showLoading();
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                Swal.fire(
                    "Berhasil",
                    "Data bank sampah berhasil diperbarui",
                    "success"
                );
                modalEdit.classList.remove("active");
                loadData();
            } else {
                throw new Error("Gagal update");
            }
        } catch (err) {
            Swal.fire(
                "Gagal",
                "Terjadi kesalahan saat menyimpan data",
                "error"
            );
        } finally {
            hideLoading();
        }
    };

    // Close Modal Events
    document.querySelectorAll(".btn-tutup, .btn-batal").forEach((b) => {
        b.onclick = () => {
            modalTambah.classList.remove("active");
            modalEdit.classList.remove("active");
        };
    });

    // Search
    searchInput.oninput = () => {
        const k = searchInput.value.toLowerCase();
        filteredData = dataBank.filter(
            (i) =>
                i.nama.toLowerCase().includes(k) ||
                i.alamat.toLowerCase().includes(k)
        );
        currentPage = 1;
        renderTabel();
    };

    // Init
    (async () => {
        await loadKategori();
        loadData();
    })();
});
