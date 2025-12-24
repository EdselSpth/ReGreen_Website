document.addEventListener("DOMContentLoaded", () => {
    console.log("kelolaAkun.js loaded");

    const API_BASE_URL = "http://localhost:3000/api/users";

    let currentPage = 1;
    let currentLimit = 10;
    let currentSearch = "";

    const tblUsers = document.querySelector("#data-pengguna-body");
    const pageInfo = document.querySelector("#page-info");
    const paginationContainer = document.querySelector("#pagination-container");
    const formSearch = document.querySelector("#form-search");

    const formTambah = document.querySelector("#form-tambah");
    const formEdit = document.querySelector("#form-edit");
    const formPassword = document.querySelector("#form-password");

    loadUsers();

    if (formSearch) {
        formSearch.addEventListener("submit", (e) => {
            e.preventDefault();
            currentSearch = document.getElementById("search-input").value;
            currentPage = 1;
            loadUsers();
        });
    }

    function loadUsers() {
        tblUsers.innerHTML =
            "<tr><td colspan='4' style='text-align:center; padding: 20px;'>Sedang memuat data...</td></tr>";

        let url = `${API_BASE_URL}?page=${currentPage}&limit=${currentLimit}`;
        if (currentSearch) {
            url += `&search=${encodeURIComponent(currentSearch)}`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((response) => {
                tblUsers.innerHTML = "";

                if (response.status === "success") {
                    const userData = response.data.data;
                    const paginationData = response.data.pagination;

                    if (userData && userData.length > 0) {
                        userData.forEach((item) => addUserRow(item));

                        renderPagination(paginationData);
                    } else {
                        tblUsers.innerHTML =
                            "<tr><td colspan='4' style='text-align:center; padding: 20px;'>Data tidak ditemukan</td></tr>";
                        pageInfo.innerText = "0 Data";
                        paginationContainer.innerHTML = "";
                    }
                } else {
                    console.error("API Error:", response.message);
                    tblUsers.innerHTML = `<tr><td colspan='4' style='text-align:center; color:red;'>Error: ${response.message}</td></tr>`;
                }
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                tblUsers.innerHTML =
                    "<tr><td colspan='4' style='text-align:center; color:red;'>Gagal koneksi ke Server Node.js</td></tr>";
            });
    }

    function addUserRow(item) {
        const tr = document.createElement("tr");

        const roleColor = item.role === "Admin" ? "#e74a3b" : "#1cc88a";
        const roleBadge = `<span style="background-color: ${roleColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${item.role}</span>`;

        tr.innerHTML = `
            <td style="padding: 10px;">${item.username}</td>
            <td style="padding: 10px;">${item.email}</td>
            <td style="padding: 10px;">${roleBadge}</td>
            <td style="padding: 10px;">
                <button class="btn-aksi btn-edit" style="margin-right:5px;"
                    onclick="openEditModal('${item.id}', '${item.username}', '${item.email}', '${item.role}')">
                    ✏️ Edit
                </button>
                <button class="btn-aksi btn-hapus" style="margin-right:5px;"
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

    function renderPagination(pagination) {
        if (!pagination) return;

        const { current_page, total_page, total_data } = pagination;

        pageInfo.innerText = `Halaman ${current_page} dari ${total_page} (Total: ${total_data} users)`;

        paginationContainer.innerHTML = "";

        const btnPrev = document.createElement("button");
        btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
        btnPrev.className = "btn-pagination";
        btnPrev.style.marginRight = "5px";

        btnPrev.disabled = current_page === 1;

        btnPrev.onclick = () => {
            if (current_page > 1) {
                currentPage--;
                loadUsers();
            }
        };
        paginationContainer.appendChild(btnPrev);

        const btnNext = document.createElement("button");
        btnNext.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        btnNext.className = "btn-pagination";

        btnNext.disabled = current_page === total_page || total_page === 0;

        btnNext.onclick = () => {
            if (current_page < total_page) {
                currentPage++;
                loadUsers();
            }
        };
        paginationContainer.appendChild(btnNext);
    }

    window.reloadUserData = loadUsers;

    if (formTambah) {
        formTambah.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                username: document.getElementById("tambah-username").value,
                email: document.getElementById("tambah-email").value,
                role: document.getElementById("tambah-role").value,
                password: document.getElementById("tambah-password").value,
            };

            await handleRequest(
                API_BASE_URL,
                "POST",
                data,
                "Menambah User...",
                "User berhasil ditambahkan",
                "modal-tambah"
            );
        });
    }

    if (formEdit) {
        formEdit.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("edit-user-id").value;
            const data = {
                username: document.getElementById("edit-username").value,
                email: document.getElementById("edit-email").value,
                role: document.getElementById("edit-role").value,
            };

            await handleRequest(
                `${API_BASE_URL}/${id}`,
                "PUT",
                data,
                "Mengupdate User...",
                "User berhasil diupdate",
                "modal-edit"
            );
        });
    }

    if (formPassword) {
        formPassword.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("password-user-id").value;
            const passBaru = document.getElementById("password-baru").value;
            const passKonfirm = document.getElementById(
                "password-konfirmasi"
            ).value;

            if (passBaru !== passKonfirm) {
                Swal.fire("Error", "Konfirmasi password tidak cocok!", "error");
                return;
            }

            await handleRequest(
                `${API_BASE_URL}/${id}/password`,
                "PATCH",
                { password: passBaru },
                "Mengubah Password...",
                "Password berhasil diubah",
                "modal-password"
            );
        });
    }

    async function handleRequest(
        url,
        method,
        data,
        loadingText,
        successText,
        modalIdToClose
    ) {
        try {
            Swal.fire({
                title: loadingText,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (response.ok) {
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: successText,
                    timer: 1500,
                    showConfirmButton: false,
                });
                if (modalIdToClose) closeModal(modalIdToClose);

                if (method === "POST")
                    document.getElementById("form-tambah").reset();
                if (method === "PATCH")
                    document.getElementById("form-password").reset();

                loadUsers();
            } else {
                Swal.fire(
                    "Gagal!",
                    result.message || "Terjadi kesalahan",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Gagal koneksi ke server", "error");
        }
    }
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("active");
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("active");
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
    document.getElementById("password-user-email").innerText = username;
    document.getElementById("password-baru").value = "";
    document.getElementById("password-konfirmasi").value = "";
    openModal("modal-password");
}

async function deleteUser(id, username) {
    const confirm = await Swal.fire({
        title: `Hapus ${username}?`,
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
            const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: "DELETE",
            });
            const result = await res.json();

            if (res.ok) {
                Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
                window.reloadUserData();
            } else {
                Swal.fire("Gagal!", result.message, "error");
            }
        } catch (err) {
            Swal.fire("Error!", "Gagal koneksi server", "error");
        }
    }
}
