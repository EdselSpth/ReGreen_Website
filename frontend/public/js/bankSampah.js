document.addEventListener("DOMContentLoaded", () => {
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
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal load data");
      dataBank = await res.json();
      renderTabel();
    } catch (err) {
      console.error(err);
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; color:red;">
            Gagal memuat data dari server
          </td>
        </tr>`;
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
  tombolTutup.forEach(btn => btn.addEventListener("click", closeAllModals));
  tombolBatal.forEach(btn => btn.addEventListener("click", closeAllModals));

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
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      formTambah.reset();
      closeAllModals();
      loadData();
    } catch (err) {
      alert("Gagal menambahkan data");
    }
  });

  tableBody.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // HAPUS
    if (e.target.classList.contains("btn-hapus")) {
      if (confirm("Yakin ingin menghapus data ini?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        loadData();
      }
    }

    // BUKA MODAL EDIT
    if (e.target.classList.contains("btn-edit")) {
      const bank = dataBank.find(item => item.id === id);

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
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      closeAllModals();
      loadData();
    } catch (err) {
      alert("Gagal update data");
    }
  });
  
  loadData();
});
