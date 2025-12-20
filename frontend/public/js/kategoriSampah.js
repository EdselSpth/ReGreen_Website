document.addEventListener("DOMContentLoaded", () => {
    /* =====================
       CONFIG & ELEMENTS
    ===================== */
    const API_URL = "http://localhost:3000/api/jenisSampah";
    
    const loading = document.getElementById("loading-overlay");
    const tableBody = document.getElementById("data-body");
    const tombolTambah = document.getElementById("btnTambah");
    const modalTambah = document.getElementById("modal-tambah");
    const modalEdit = document.getElementById("modal-edit");
    const formTambah = document.getElementById("form-tambah");
    const formEdit = document.getElementById("form-edit");
    const tombolTutup = document.querySelectorAll(".btn-tutup, .btn-batal");

    let dataJenis = [];

    const showLoading = () => loading?.classList.add("active");
    const hideLoading = () => loading?.classList.remove("active");

    /* =====================
       LOAD DATA
    ===================== */
    async function loadData() {
        try {
            showLoading();
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Gagal mengambil data");
            
            const result = await res.json();
            // Menangani berbagai kemungkinan format response API
            dataJenis = result.data || result; 
            renderTable();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    }

    /* =====================
       RENDER TABLE
    ===================== */
    function renderTable() {
        tableBody.innerHTML = "";

        if (!dataJenis || dataJenis.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">Belum ada data jenis sampah</td>
                </tr>`;
            return;
        }

        dataJenis.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.nama_jenis}</td>
                <td>Rp ${Number(item.harga_per_kg).toLocaleString("id-ID")}</td>
                <td>
                    <button class="btn-aksi btn-edit" data-id="${item.id}">Edit</button>
                    <button class="btn-aksi btn-hapus" data-id="${item.id}">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    /* =====================
       MODAL HANDLER
    ===================== */
    const openModal = (modal) => modal.classList.add("active");
    const closeAllModals = () => {
        modalTambah.classList.remove("active");
        modalEdit.classList.remove("active");
        formTambah.reset();
        formEdit.reset();
    };

    tombolTambah.addEventListener("click", () => openModal(modalTambah));
    tombolTutup.forEach(btn => btn.addEventListener("click", closeAllModals));

    window.addEventListener("click", (e) => {
        if (e.target === modalTambah || e.target === modalEdit) closeAllModals();
    });

    /* =====================
       CREATE (POST)
    ===================== */
    formTambah.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newData = {
            nama_jenis: document.getElementById("tambah-nama").value,
            harga_per_kg: parseInt(document.getElementById("tambah-harga").value),
        };

        try {
            showLoading();
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData),
            });

            if (!res.ok) throw new Error("Gagal menyimpan data");

            await Swal.fire("Sukses", "Jenis sampah berhasil ditambahkan", "success");
            closeAllModals();
            loadData();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    });

    /* =====================
       TABLE ACTIONS (EDIT & DELETE)
    ===================== */
    tableBody.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        // DELETE LOGIC
        if (e.target.classList.contains("btn-hapus")) {
            const confirm = await Swal.fire({
                title: "Yakin?",
                text: "Data akan dihapus permanen",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Hapus",
                cancelButtonText: "Batal",
            });

            if (confirm.isConfirmed) {
                try {
                    showLoading();
                    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error("Gagal menghapus data dari server");
                    
                    await Swal.fire("Terhapus", "Data berhasil dihapus", "success");
                    loadData();
                } catch (err) {
                    Swal.fire("Error", err.message, "error");
                } finally {
                    hideLoading();
                }
            }
        }

        // OPEN EDIT MODAL LOGIC
        if (e.target.classList.contains("btn-edit")) {
            const data = dataJenis.find(item => item.id == id); // Gunakan == agar string/number tidak masalah
            if (!data) return;

            document.getElementById("edit-id").value = data.id;
            document.getElementById("edit-nama").value = data.nama_jenis;
            document.getElementById("edit-harga").value = data.harga_per_kg;

            openModal(modalEdit);
        }
    });

    /* =====================
       UPDATE (PUT)
    ===================== */
    formEdit.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
        const updatedData = {
            nama_jenis: document.getElementById("edit-nama").value,
            harga_per_kg: parseInt(document.getElementById("edit-harga").value),
        };

        try {
            showLoading();
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error("Gagal memperbarui data");

            await Swal.fire("Sukses", "Data berhasil diperbarui", "success");
            closeAllModals();
            loadData();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    });

    loadData();
});