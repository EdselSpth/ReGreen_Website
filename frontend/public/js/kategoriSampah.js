document.addEventListener("DOMContentLoaded", () => {
    console.log("kategoriSampah.js loaded");

    const API_BASE_URL = "http://localhost:3000/api/jenisSampah";

    let currentPage = 1;
    let currentLimit = 10;
    let currentSearch = "";

    const tableBody = document.getElementById("data-body");
    const pageInfo = document.getElementById("page-info");
    const paginationContainer = document.getElementById("pagination-container");
    const formSearch = document.getElementById("form-search");

    const tombolTambah = document.getElementById("btnTambah");
    const modalTambah = document.getElementById("modal-tambah");
    const modalEdit = document.getElementById("modal-edit");

    const formTambah = document.getElementById("form-tambah");
    const formEdit = document.getElementById("form-edit");

    const tombolTutup = document.querySelectorAll(".btn-tutup");
    const tombolBatal = document.querySelectorAll(".btn-batal");

    let dataKategori = [];

    //LOADING
    const loadingOverlay = document.getElementById("loading-overlay");
    const showLoading = () => loadingOverlay?.classList.add("active");
    const hideLoading = () => loadingOverlay?.classList.remove("active");

    //SEARCH
    if (formSearch) {
        const searchInput = document.getElementById("search-input");

        searchInput.addEventListener("input", () => {
            currentSearch = searchInput.value;
            currentPage = 1;
            loadKategori();
        });
    }

    //LOAD DATA
    async function loadKategori() {
        try {
            showLoading();
            let url = `${API_BASE_URL}?page=${currentPage}&limit=${currentLimit}`;
            if (currentSearch)
                url += `&search=${encodeURIComponent(currentSearch)}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Gagal koneksi ke server");
            const result = await res.json();

            if (result.status !== "success")
                throw new Error(result.message || "Gagal memuat data");

            dataKategori = result.data.data;
            renderTable(dataKategori);
            renderPagination(result.data.pagination);
        } catch (err) {
            Swal.fire("Error", err.message, "error");
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">${err.message}</td></tr>`;
        } finally {
            hideLoading();
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = "";
        if (!data || data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Data tidak ditemukan</td></tr>`;
            return;
        }

        data.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${(currentPage - 1) * currentLimit + index + 1}</td>
                <td>${item.nama_jenis}</td>
                <td>Rp ${Number(item.harga_per_kg).toLocaleString("id-ID")}</td>
                <td>
                    <button class="btn-aksi btn-edit" data-id="${
                        item.id
                    }">✏️ Edit</button>
                    <button class="btn-aksi btn-hapus" data-id="${
                        item.id
                    }">🗑️ Hapus</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    //PAGINATION
    function renderPagination(pagination) {
        if (!pagination) return;

        const {
            currentPage: apiCurrentPage,
            totalPages,
            totalItems,
        } = pagination;

        pageInfo.innerText = `Halaman ${apiCurrentPage} dari ${totalPages} (Total: ${totalItems})`;
        paginationContainer.innerHTML = "";

        if (totalPages <= 1) return;

        // === PREV ===
        const btnPrev = document.createElement("button");
        btnPrev.type = "button";
        btnPrev.innerHTML = "&laquo; Prev";
        btnPrev.className = "btn-pagination";
        btnPrev.disabled = apiCurrentPage === 1;
        btnPrev.onclick = () => {
            if (apiCurrentPage > 1) {
                currentPage = apiCurrentPage - 1;
                loadKategori();
            }
        };
        paginationContainer.appendChild(btnPrev);

        let startPage, endPage;

        if (totalPages <= 7) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (apiCurrentPage <= 4) {
                startPage = 1;
                endPage = 5;
            } else if (apiCurrentPage + 3 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = apiCurrentPage - 2;
                endPage = apiCurrentPage + 2;
            }
        }

        if (startPage > 1) {
            addPageButton(1, apiCurrentPage);
            if (startPage > 2) paginationContainer.appendChild(createDots());
        }

        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i, apiCurrentPage);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1)
                paginationContainer.appendChild(createDots());
            addPageButton(totalPages, apiCurrentPage);
        }

        // === NEXT ===
        const btnNext = document.createElement("button");
        btnNext.type = "button";
        btnNext.innerHTML = "Next &raquo;";
        btnNext.className = "btn-pagination";
        btnNext.disabled = apiCurrentPage === totalPages;
        btnNext.onclick = () => {
            if (apiCurrentPage < totalPages) {
                currentPage = apiCurrentPage + 1;
                loadKategori();
            }
        };
        paginationContainer.appendChild(btnNext);
    }

    function addPageButton(pageNumber, currentPageApi) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.innerText = pageNumber;
        btn.className = "btn-pagination";

        if (pageNumber === currentPageApi) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            currentPage = pageNumber;
            loadKategori();
        };

        paginationContainer.appendChild(btn);
    }

    function createDots() {
        const span = document.createElement("span");
        span.innerText = "...";
        span.style.padding = "6px";
        return span;
    }

    //MODAL
    function openModal(modal) {
        modal.classList.add("active");
    }
    function closeAllModals() {
        modalTambah.classList.remove("active");
        modalEdit.classList.remove("active");
        formTambah.reset();
        formEdit.reset();
    }

    tombolTambah.addEventListener("click", () => openModal(modalTambah));
    tombolTutup.forEach((btn) => btn.addEventListener("click", closeAllModals));
    tombolBatal.forEach((btn) => btn.addEventListener("click", closeAllModals));

    window.addEventListener("click", (e) => {
        if (e.target === modalTambah || e.target === modalEdit)
            closeAllModals();
    });

    //CREATE
    formTambah?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const namaBaru = document.getElementById("tambah-nama").value.trim();
        const hargaBaru = parseInt(
            document.getElementById("tambah-harga").value
        );

        //DUPLIKAT
        const duplicate = dataKategori.find(
            (k) => k.nama_jenis.toLowerCase() === namaBaru.toLowerCase()
        );
        if (duplicate) {
            Swal.fire("Gagal!", "Nama kategori sudah ada", "warning");
            return;
        }

        const data = {
            nama_jenis: namaBaru,
            harga_per_kg: hargaBaru,
        };
        await handleRequest(
            API_BASE_URL,
            "POST",
            data,
            "Menambahkan kategori...",
            "Kategori berhasil ditambahkan",
            modalTambah
        );
    });

    //EDIT
    tableBody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("btn-edit")) {
            const kategori = dataKategori.find((k) => k.id == id);
            if (!kategori) return;

            document.getElementById("edit-id").value = kategori.id;
            document.getElementById("edit-nama").value = kategori.nama_jenis;
            document.getElementById("edit-harga").value = kategori.harga_per_kg;
            openModal(modalEdit);
        }

        if (e.target.classList.contains("btn-hapus")) {
            deleteKategori(id);
        }
    });

    //UPDATE
    formEdit?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("edit-id").value;
        const namaBaru = document.getElementById("edit-nama").value.trim();
        const hargaBaru = parseInt(document.getElementById("edit-harga").value);

        const duplicate = dataKategori.find(
            (k) =>
                k.nama_jenis.toLowerCase() === namaBaru.toLowerCase() &&
                k.id != id
        );

        if (duplicate) {
            Swal.fire(
                "Gagal!",
                "Nama kategori sudah digunakan oleh kategori lain",
                "warning"
            );
            return;
        }

        const data = {
            nama_jenis: namaBaru,
            harga_per_kg: hargaBaru,
        };

        await handleRequest(
            `${API_BASE_URL}/${id}`,
            "PUT",
            data,
            "Mengupdate kategori...",
            "Kategori berhasil diperbarui",
            modalEdit
        );
    });

    //DELETE
    async function deleteKategori(id) {
        const confirm = await Swal.fire({
            title: "Yakin?",
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!",
        });

        if (confirm.isConfirmed) {
            try {
                Swal.fire({
                    title: "Menghapus...",
                    didOpen: () => Swal.showLoading(),
                });
                const res = await fetch(`${API_BASE_URL}/${id}`, {
                    method: "DELETE",
                });
                if (res.ok)
                    Swal.fire("Terhapus!", "Data berhasil dihapus", "success");
                loadKategori();
            } catch {
                Swal.fire("Error!", "Gagal koneksi server", "error");
            }
        }
    }

    //HANDLE REQUEST (CREATE & UPDATE)
    async function handleRequest(
        url,
        method,
        data,
        loadingText,
        successText,
        modal
    ) {
        try {
            Swal.fire({
                title: loadingText,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                Swal.fire("Berhasil!", successText, "success");
                closeAllModals();
                loadKategori();
            } else {
                Swal.fire(
                    "Gagal!",
                    result.message || "Terjadi kesalahan",
                    "error"
                );
            }
        } catch (err) {
            Swal.fire("Error!", "Gagal koneksi ke server", "error");
        }
    }
    //INIT
    loadKategori();
});
