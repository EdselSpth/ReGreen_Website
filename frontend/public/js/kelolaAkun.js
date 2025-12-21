document.addEventListener("DOMContentLoaded", () => {
    console.log("kelolaAkun.js loaded");

    const tblUsers = document.querySelector("#data-pengguna-body");
    const formTambah = document.querySelector("#form-tambah");
    const formEdit = document.querySelector("#form-edit");
    const formPassword = document.querySelector("#form-password");
    const pageInfo = document.querySelector("#page-info");

    // --- INITIAL LOAD ---
    loadUsers();

    // --- EVENT LISTENER FOR FORM TAMBAH ---
    if (formTambah) {
        formTambah.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Mengambil value dari input
            const username = document.getElementById("tambah-username").value;
            const email = document.getElementById("tambah-email").value;
            const role = document.getElementById("tambah-role").value;
            const password = document.getElementById("tambah-password").value;

            const data = { username, email, role, password };

            try {
                const res = await fetch("http://localhost:3000/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (res.ok) {
                    alert("Berhasil: " + result.message);
                    closeModal('modal-tambah');
                    formTambah.reset();
                    loadUsers(); // Reload data tanpa refresh halaman
                } else {
                    alert("Gagal menambah data: " + result.message);
                }
            } catch (err) {
                console.error("Create error:", err);
                alert("Terjadi kesalahan koneksi saat menambah user");
            }
        });
    }

    // --- EVENT LISTENER FOR FORM EDIT ---
    if (formEdit) {
        formEdit.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = document.getElementById("edit-user-id").value;
            const username = document.getElementById("edit-username").value;
            const email = document.getElementById("edit-email").value;
            const role = document.getElementById("edit-role").value;

            const data = { username, email, role };

            try {
                const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (res.ok) {
                    alert("Data berhasil diupdate!");
                    closeModal('modal-edit');
                    loadUsers();
                } else {
                    alert("Gagal update: " + result.message);
                }
            } catch (err) {
                console.error("Update error:", err);
                alert("Terjadi kesalahan koneksi");
            }
        });
    }

    // --- EVENT LISTENER FOR FORM PASSWORD ---
    if (formPassword) {
        formPassword.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const id = document.getElementById("password-user-id").value;
            const password = document.getElementById("password-baru").value;

            try {
                const res = await fetch(`http://localhost:3000/api/users/${id}/password`, {
                    method: "PATCH", // Sesuaikan dengan route Node.js kamu (PUT/PATCH)
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password })
                });

                const result = await res.json();

                if (res.ok) {
                    alert("Password berhasil diubah!");
                    closeModal('modal-password');
                    formPassword.reset();
                } else {
                    alert("Gagal: " + result.message);
                }
            } catch (err) {
                console.error("Password error:", err);
                alert("Terjadi kesalahan koneksi");
            }
        });
    }

    // --- FUNGSI LOAD DATA ---
    function loadUsers() {
        // Tampilkan status loading
        tblUsers.innerHTML = "<tr><td colspan='4' style='text-align:center'>Memuat data...</td></tr>";

        fetch("http://localhost:3000/api/users")
            .then(res => res.json())
            .then(response => {
                tblUsers.innerHTML = "";
                // Handle jika response.data ada (format standar API kamu) atau langsung array
                const rows = response.data ? response.data : response; 
                
                if (rows && rows.length > 0) {
                    rows.forEach(item => addUserRow(item));
                    if(pageInfo) pageInfo.innerText = `Total Data: ${rows.length}`;
                } else {
                    tblUsers.innerHTML = "<tr><td colspan='4' style='text-align:center'>Tidak ada data user</td></tr>";
                    if(pageInfo) pageInfo.innerText = "Tidak ada data.";
                }
            })
            .catch(err => {
                console.error("Load error:", err);
                tblUsers.innerHTML = "<tr><td colspan='4' style='text-align:center; color:red;'>Gagal koneksi ke server Node.js</td></tr>";
            });
    }

    // --- FUNGSI MANIPULASI DOM (Row Generator) ---
    function addUserRow(item) {
        const tr = document.createElement("tr");
        
        // Perhatikan penggunaan onlick di bawah ini (Gaya kodingan temanmu)
        // Kita kirim data sebagai parameter biar gampang diambil pas diklik
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
                    onclick="openPasswordModal('${item.id}')">
                    🔑 Pass
                </button>
            </td>
        `;
        tblUsers.appendChild(tr);
    }

    // Agar fungsi loadUsers bisa dipanggil dari luar jika perlu (opsional)
    window.reloadUserData = loadUsers;
});

// --- FUNGSI GLOBAL (DI LUAR DOMContentLoaded) ---
// Ini biar bisa dipanggil pakai onclick="namaFungsi()" dari HTML

// Fungsi Modal Global
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active"); // Sesuai CSS kamu yang pakai class active
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("active");
    }
}

// Fungsi Buka Modal Edit (Dipanggil dari tombol Edit di tabel)
function openEditModal(id, username, email, role) {
    document.getElementById("edit-user-id").value = id;
    document.getElementById("edit-username").value = username;
    document.getElementById("edit-email").value = email;
    document.getElementById("edit-role").value = role;
    
    openModal('modal-edit');
}

// Fungsi Buka Modal Password
function openPasswordModal(id) {
    document.getElementById("password-user-id").value = id;
    document.getElementById("password-baru").value = ""; // Reset input
    
    openModal('modal-password');
}

// Fungsi Delete User
async function deleteUser(id, username) {
    if (!confirm(`Yakin ingin menghapus user "${username}"?`)) return;

    try {
        const res = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: "DELETE"
        });
        
        const result = await res.json();

        if (res.ok) {
            alert("User berhasil dihapus!");
            // Panggil fungsi reload yang kita pasang di window tadi
            if (window.reloadUserData) window.reloadUserData(); 
            else location.reload(); 
        } else {
            alert("Gagal menghapus: " + result.message);
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Terjadi kesalahan koneksi");
    }
}