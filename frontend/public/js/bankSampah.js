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

    async function loadData() {
        try {
            showLoading();
            const res = await fetch(API_URL);
            dataBank = await res.json();
            renderTabel();
        } catch (err) {
            Swal.fire("Error", "Gagal memuat data", "error");
        } finally {
            hideLoading();
        }
    }

    function renderTabel() {
        tableBody.innerHTML = "";

        if (dataBank.length === 0) {
            tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">
            Belum ada data bank sampah
          </td>
        </tr>`;
            return;
        }

        dataBank.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${item.nama}</td>
        <td>${item.alamat}</td>
        <td>${item.jenis}</td>
        <td>
          <span class="badge ${item.status === "Aktif" ? "aktif" : "nonaktif"}">
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
