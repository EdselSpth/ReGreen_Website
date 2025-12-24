document.addEventListener("DOMContentLoaded", () => {
    console.log("kelolaAkun.js loaded");

    const tblUsers = document.querySelector("#data-pengguna-body");
    const formTambah = document.querySelector("#form-tambah");
    const formEdit = document.querySelector("#form-edit");
    const formPassword = document.querySelector("#form-password");
    const pageInfo = document.querySelector("#page-info");

    loadUsers();

    if (formTambah) {
        formTambah.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("tambah-username").value;
            const email = document.getElementById("tambah-email").value;
            const role = document.getElementById("tambah-role").value;
            const password = document.getElementById("tambah-password").value;

            const data = { username, email, role, password };

            try {
                Swal.fire({
                    title: "Proses menambah di database",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                const response = await fetch(
                    "http://localhost:3000/api/users",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    }
                );

                const result = await response.json();

                if (response.ok) {
                    await Swal.fire({
                        title: "Sukses!",
                        text: "User baru berhasil ditambahkan",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    closeModal("modal-tambah");
                    formTambah.reset();
                    loadUsers();
                } else {
                    Swal.fire({
                        title: "Gagal!",
                        text: result.message || "Gagal menambah data.",
                        icon: "error",
                    });
                }
            } catch (error) {
                console.error("Create error:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Terjadi kesalahan koneksi server.",
                    icon: "error",
                });
            }
        });
    }

    if (formEdit) {
        formEdit.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = document.getElementById("edit-user-id").value;
            const username = document.getElementById("edit-username").value;
            const email = document.getElementById("edit-email").value;
            const role = document.getElementById("edit-role").value;

            const data = { username, email, role };

            try {
                Swal.fire({
                    title: "Mengupdate Data...",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                const response = await fetch(
                    `http://localhost:3000/api/users/${id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    }
                );

                const result = await response.json();

                if (response.ok) {
                    await Swal.fire({
                        title: "Berhasil!",
                        text: "Data user berhasil diupdate!",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    closeModal("modal-edit");
                    loadUsers();
                } else {
                    Swal.fire({
                        title: "Gagal!",
                        text: result.message || "Gagal update data.",
                        icon: "error",
                    });
                }
            } catch (error) {
                console.erroror("Update error:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Terjadi kesalahan koneksi.",
                    icon: "error",
                });
            }
        });
    }

    if (formPassword) {
        formPassword.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = document.getElementById("password-user-id").value;
            const password = document.getElementById("password-baru").value;
            
            try {
                Swal.fire({
                    title: 'Mengubah Password...',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                const response = await fetch(`http://localhost:3000/api/users/${id}/password`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password }),
                });

                const result = await response.json();

                if (response.ok) {
                    await Swal.fire({
                        title: 'Berhasil!',
                        text: 'Password berhasil diubah!',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    closeModal("modal-password");
                    formPassword.reset();
                } else {
                    Swal.fire({
                        title: 'Gagal!',
                        text: result.message || 'Gagal mengubah password.',
                        icon: 'error'
                    });
                }
            } catch (error) {
                console.error("Password error:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan koneksi.',
                    icon: 'error'
                });
            }
        });
    }

    function loadUsers() {
        tblUsers.innerHTML =
            "<tr><td colspan='4' style='text-align:center'>Memuat data...</td></tr>";

        fetch("http://localhost:3000/api/users")
            .then((res) => res.json())
            .then((response) => {
                tblUsers.innerHTML = "";
                const rows = response.data ? response.data : response;

                if (rows && rows.length > 0) {
                    rows.forEach((item) => addUserRow(item));
                    if (pageInfo)
                        pageInfo.innerText = `Total Data: ${rows.length}`;
                } else {
                    tblUsers.innerHTML =
                        "<tr><td colspan='4' style='text-align:center'>Tidak ada data user</td></tr>";
                    if (pageInfo) pageInfo.innerText = "Tidak ada data.";
                }
            })
            .catch((err) => {
                console.error("Load error:", err);
                tblUsers.innerHTML =
                    "<tr><td colspan='4' style='text-align:center; color:red;'>Gagal koneksi ke server Node.js</td></tr>";
            });
    }

    function addUserRow(item) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.username}</td>
            <td>${item.email}</td>
            <td>${item.role}</td>
            <td>
                <button class="btn-aksi btn-edit" 
                    onclick="openEditModal('${item.id}', '${item.username}', '${item.email}', '${item.role}')">
                    ✏️ Edit
                </button>
                <button class="btn-aksi btn-hapus" 
                    onclick="deleteUser('${item.id}', '${item.username}')">
                    🗑️ Hapus
                </button>
                <button class="btn-aksi btn-password" 
                    onclick="openPasswordModal('${item.id}', '${item.username}')">
                    🔑 Pass
                </button>
            </td>
        `;
        tblUsers.appendChild(tr);
    }

    window.reloadUserData = loadUsers;
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active");
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("active");
    }
}

function openEditModal(id, username, email, role) {
    document.getElementById("edit-user-id").value = id;
    document.getElementById("edit-username").value = username;
    document.getElementById("edit-email").value = email;
    document.getElementById("edit-role").value = role;

    openModal("modal-edit");
}

function openPasswordModal(id, username) {
    document.getElementById("password-user-id").value = id;

    const labelNama = document.getElementById("password-user-email");
    if (labelNama) {
        labelNama.innerText = username; 
    }

    document.getElementById("password-baru").value = "";

    openModal("modal-password");
}

async function deleteUser(id, username) {
    const result = await Swal.fire({
        title: `Hapus user ${username}`,
        text: "Data yang dihapus tidak dapat dikembalikan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: "Proses Menghapus di database",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const respond = await fetch(
                `http://localhost:3000/api/users/${id}`,
                { method: "DELETE" }
            );
            const result = await respond.json();

            if (respond.ok) {
                await Swal.fire({
                    title: "Terhapus!",
                    text: "Data berhasil dihapus",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
                if (window.reloadUserData) window.reloadUserData();
                else location.reload();
            } else {
                Swal.fire({
                    title: "Gagal!",
                    text: result.message || "Gagal menghapus data.",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire({
                title: "Error!",
                text: "Terjadi kesalahan koneksi server.",
                icon: "error",
            });
        }
    }
}
