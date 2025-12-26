document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading-overlay");

    function showLoading() {
        loading.classList.add("active");
    }

    function hideLoading() {
        loading.classList.remove("active");
    }

    const API_URL = "http://localhost:3000/api/bankSampah";

    const tableBody = document.getElementById("data-bank-body");
    const tombolTambah = document.querySelector(".btn-tambah");
    const modalTambah = document.getElementById("modal-tambah");
    const modalEdit = document.getElementById("modal-edit");

    const formTambah = document.getElementById("form-tambah");
    const formEdit = document.getElementById("form-edit");

    const tombolTutup = document.querySelectorAll(".btn-tutup");
    const tombolBatal = document.querySelectorAll(".btn-batal");

    let dataBank = [];

    let currentPage = 1;
    const rowsPerPage = 5;
    let filteredData = [];

    const searchInput = document.getElementById("search-bank");
    const paginationEl = document.getElementById("pagination");
    const infoData = document.getElementById("info-data");

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();

        filteredData = dataBank.filter(
            (item) =>
                item.nama.toLowerCase().includes(keyword) ||
                item.alamat.toLowerCase().includes(keyword) ||
                item.jenis.toLowerCase().includes(keyword)
        );

        currentPage = 1;
        renderTabel();
    });

    async function loadData() {
        try {
            showLoading();
            const res = await fetch(API_URL);
            dataBank = await res.json();
            filteredData = dataBank;
            renderTabel();
        } catch {
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
            tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">
            Data tidak ditemukan
          </td>
        </tr>`;
            paginationEl.innerHTML = "";
            infoData.innerText = "";
            return;
        }

        pageData.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
          <td>${item.nama}</td>
          <td>${item.alamat}</td>
          <td>${item.jenis}</td>
          <td>
            <span class="badge ${item.status === "Aktif" ? "badge-aktif" : "badge-nonaktif"}">
                ${item.status}
            </span>
          </td>

          <td>
            <button class="btn-aksi btn-edit" data-id="${item.id}">Edit</button>
            <button class="btn-aksi btn-hapus" data-id="${item.id}">Hapus</button>
          </td>
        `;
            tableBody.appendChild(row);
        });

        renderPagination();
    }

    function renderPagination() {
        paginationEl.innerHTML = "";
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);

        infoData.innerText = `Menampilkan ${Math.min(
            rowsPerPage,
            filteredData.length - (currentPage - 1) * rowsPerPage
        )} dari ${filteredData.length} data`;


        if (totalPages <= 1) return;

        const createButton = (page, text = page) => {
            const btn = document.createElement("button");
            btn.innerText = text;
            btn.classList.toggle("active", page === currentPage);
            btn.disabled = text === "...";
            
            if (page !== "dotts") {
                btn.addEventListener("click", () => {
                    currentPage = page;
                    renderTabel();
                });
            }

            paginationEl.appendChild(btn);
        }

        createButton(1);

        if (currentPage > 3) {
            createButton("dotts", "...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            createButton(i);
        }

        if (currentPage < totalPages - 2) {
            createButton("dotts", "...");
        }

        if (totalPages > 1) {
            createButton(totalPages);
        }
    }

    function openModal(modal) {
        modal.classList.add("active");
    }

    function closeAllModals() {
        modalTambah.classList.remove("active");
        modalEdit.classList.remove("active");
    }

    tombolTambah.addEventListener("click", () => openModal(modalTambah));
    tombolTutup.forEach((btn) => btn.addEventListener("click", closeAllModals));
    tombolBatal.forEach((btn) => btn.addEventListener("click", closeAllModals));

    window.addEventListener("click", (e) => {
        if (e.target === modalTambah || e.target === modalEdit) {
            closeAllModals();
        }
    });

    formTambah.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newData = {
            nama: document.getElementById("tambah-nama").value,
            alamat: document.getElementById("tambah-alamat").value,
            jenis: document.getElementById("tambah-jenis").value,
            status: document.getElementById("tambah-status").value,
        };

        try {
            showLoading();
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData),
            });

            Swal.fire("Sukses", "Data berhasil ditambahkan", "success");
            formTambah.reset();
            closeAllModals();
            loadData();
        } catch {
            Swal.fire("Error", "Gagal menambahkan data", "error");
        } finally {
            hideLoading();
        }
    });

    tableBody.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;

        // HAPUS
        if (e.target.classList.contains("btn-hapus")) {
            const id = Number(e.target.dataset.id);

            Swal.fire({
                title: "Yakin?",
                text: "Data akan dihapus permanen",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Hapus",
                cancelButtonText: "Batal",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    showLoading();
                    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                    hideLoading();
                    Swal.fire("Terhapus", "Data berhasil dihapus", "success");
                    loadData();
                }
            });
        }

        // BUKA MODAL EDIT
        if (e.target.classList.contains("btn-edit")) {
            const id = Number(e.target.dataset.id); // ⬅️ FIX UTAMA

            const bank = dataBank.find((item) => item.id === id);

            if (!bank) {
                console.error("Data bank tidak ditemukan", id);
                return;
            }

            document.getElementById("edit-index").value = bank.id;
            document.getElementById("edit-nama").value = bank.nama;
            document.getElementById("edit-alamat").value = bank.alamat;
            document.getElementById("edit-jenis").value = bank.jenis;
            document.getElementById("edit-status").value = bank.status;

            openModal(modalEdit);
        }
    });

    formEdit.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("edit-index").value;

        const updatedData = {
            nama: document.getElementById("edit-nama").value,
            alamat: document.getElementById("edit-alamat").value,
            jenis: document.getElementById("edit-jenis").value,
            status: document.getElementById("edit-status").value,
        };

        try {
            showLoading();
            await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            Swal.fire("Sukses", "Data berhasil diupdate", "success");
            closeAllModals();
            loadData();
        } catch {
            Swal.fire("Error", "Gagal update data", "error");
        } finally {
            hideLoading();
        }
    });

    loadData();
});
