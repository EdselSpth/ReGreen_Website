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

    // ===================== LOADING =====================
    const loadingOverlay = document.getElementById("loading-overlay");
    const showLoading = () => loadingOverlay?.classList.add("active");
    const hideLoading = () => loadingOverlay?.classList.remove("active");

    // ===================== SEARCH =====================
    if (formSearch) {
        formSearch.addEventListener("submit", (e) => {
            e.preventDefault();
            currentSearch = document.getElementById("search-input").value;
            currentPage = 1;
            loadKategori();
        });
    }

    // ===================== LOAD DATA =====================
    async function loadKategori() {
        try {
            showLoading();
            let url = `${API_BASE_URL}?page=${currentPage}&limit=${currentLimit}`;
            if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Gagal koneksi ke server");
            const result = await res.json();

            if (result.status !== "success") throw new Error(result.message || "Gagal memuat data");

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
                    <button class="btn-aksi btn-edit" data-id="${item.id}">✏️ Edit</button>
                    <button class="btn-aksi btn-hapus" data-id="${item.id}">🗑️ Hapus</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // ===================== PAGINATION =====================
    function renderPagination(pagination) {
    if (!pagination) return;
    const { currentPage, totalPages, totalItems } = pagination;
    pageInfo.innerText = `Halaman ${currentPage} dari ${totalPages} (Total: ${totalItems})`;
    paginationContainer.innerHTML = "";

    const btnPrev = document.createElement("button");
    btnPrev.className = "btn-pagination";
    btnPrev.textContent = "Previous";
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = () => { currentPage--; loadKategori(); };

    const btnNext = document.createElement("button");
    btnNext.className = "btn-pagination";
    btnNext.textContent = "Next";
    btnNext.disabled = currentPage === totalPages || totalPages === 0;
    btnNext.onclick = () => { currentPage++; loadKategori(); };

    paginationContainer.appendChild(btnPrev);
    paginationContainer.appendChild(btnNext);
}


    // ===================== MODAL HANDLER =====================
    function openModal(modal) { modal.classList.add("active"); }
    function closeAllModals() {
        modalTambah.classList.remove("active");
        modalEdit.classList.remove("active");
        formTambah.reset();
        formEdit.reset();
    }

    tombolTambah.addEventListener("click", () => openModal(modalTambah));
    tombolTutup.forEach(btn => btn.addEventListener("click", closeAllModals));
    tombolBatal.forEach(btn => btn.addEventListener("click", closeAllModals));

    window.addEventListener("click", (e) => {
        if (e.target === modalTambah || e.target === modalEdit) closeAllModals();
    });

    // ===================== CREATE =====================
    formTambah?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            nama_jenis: document.getElementById("tambah-nama").value,
            harga_per_kg: parseInt(document.getElementById("tambah-harga").value)
        };
        await handleRequest(API_BASE_URL, "POST", data, "Menambahkan kategori...", "Kategori berhasil ditambahkan", modalTambah);
    });

    // ===================== EDIT =====================
    tableBody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("btn-edit")) {
            const kategori = dataKategori.find(k => k.id == id);
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

    formEdit?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
        const data = {
            nama_jenis: document.getElementById("edit-nama").value,
            harga_per_kg: parseInt(document.getElementById("edit-harga").value)
        };
        await handleRequest(`${API_BASE_URL}/${id}`, "PUT", data, "Mengupdate kategori...", "Kategori berhasil diperbarui", modalEdit);
    });

    async function handleRequest(url, method, data, loadingText, successText, modal) {
        try {
            Swal.fire({ title: loadingText, allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (res.ok) {
                Swal.fire("Berhasil!", successText, "success");
                closeAllModals();
                loadKategori();
            } else {
                Swal.fire("Gagal!", result.message, "error");
            }
        } catch (err) {
            Swal.fire("Error!", "Gagal koneksi ke server", "error");
        }
    }

    async function deleteKategori(id) {
        const confirm = await Swal.fire({
            title: "Yakin?",
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!"
        });

        if (confirm.isConfirmed) {
            try {
                Swal.fire({ title: "Menghapus...", didOpen: () => Swal.showLoading() });
                const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
                if (res.ok) Swal.fire("Terhapus!", "Data berhasil dihapus", "success");
                loadKategori();
            } catch {
                Swal.fire("Error!", "Gagal koneksi server", "error");
            }
        }
    }

    // INIT LOAD
    loadKategori();
});
