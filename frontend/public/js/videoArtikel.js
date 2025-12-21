document.addEventListener("DOMContentLoaded", () => {
    /* =====================
       CONFIG & ELEMENTS
    ===================== */
    const API_VIDEO = "http://localhost:3000/api/video";
    const API_ARTIKEL = "http://localhost:3000/api/artikel";

    const loading = document.getElementById("loading-overlay");

    // TABLE BODY
    const videoBody = document.getElementById("video-body");
    const artikelBody = document.getElementById("artikel-body");

    // BUTTON
    const btnTambahVideo = document.getElementById("btnTambahVideo");
    const btnTambahArtikel = document.getElementById("btnTambahArtikel");

    // MODAL
    const modalTambahVideo = document.getElementById("modal-tambah-video");
    const modalTambahArtikel = document.getElementById("modal-tambah-artikel");

    // FORM
    const formTambahVideo = document.getElementById("form-tambah-video");
    const formTambahArtikel = document.getElementById("form-tambah-artikel");

    const tombolTutup = document.querySelectorAll(".btn-tutup, .btn-batal");

    let dataVideo = [];
    let dataArtikel = [];

    /* =====================
       LOADING HANDLER
    ===================== */
    const showLoading = () => loading?.classList.add("active");
    const hideLoading = () => loading?.classList.remove("active");

    /* =====================
       LOAD DATA
    ===================== */
    async function loadVideo() {
        try {
            showLoading();
            const res = await fetch(API_VIDEO);
            if (!res.ok) throw new Error("Gagal mengambil data video");

            const result = await res.json();
            dataVideo = result.data || result;
            renderVideo();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    }

    async function loadArtikel() {
        try {
            showLoading();
            const res = await fetch(API_ARTIKEL);
            if (!res.ok) throw new Error("Gagal mengambil data artikel");

            const result = await res.json();
            dataArtikel = result.data || result;
            renderArtikel();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    }

    /* =====================
       RENDER TABLE
    ===================== */
    function renderVideo() {
        videoBody.innerHTML = "";

        if (!dataVideo || dataVideo.length === 0) {
            videoBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">Belum ada video</td>
                </tr>`;
            return;
        }

        dataVideo.forEach((item, index) => {
            videoBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.nama_video}</td>
                    <td>
                        <a href="${
                            item.link_youtube
                        }" target="_blank">Lihat Video</a>
                    </td>
                    <td>${item.deskripsi}</td>
                    <td>
                        <button class="btn-aksi btn-hapus" data-id="${
                            item.id
                        }" data-type="video">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    function renderArtikel() {
        artikelBody.innerHTML = "";

        if (!dataArtikel || dataArtikel.length === 0) {
            artikelBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">Belum ada artikel</td>
                </tr>`;
            return;
        }

        dataArtikel.forEach((item, index) => {
            artikelBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.nama_artikel}</td>
                    <td>
                        <a href="/uploads/${
                            item.file_pdf
                        }" target="_blank">Lihat PDF</a>
                    </td>
                    <td>
                        <button class="btn-aksi btn-hapus" data-id="${
                            item.id
                        }" data-type="artikel">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    /* =====================
       MODAL HANDLER
    ===================== */
    const openModal = (modal) => modal.classList.add("active");

    const closeAllModals = () => {
        modalTambahVideo.classList.remove("active");
        modalTambahArtikel.classList.remove("active");
        formTambahVideo.reset();
        formTambahArtikel.reset();
    };

    btnTambahVideo.addEventListener("click", () => openModal(modalTambahVideo));
    btnTambahArtikel.addEventListener("click", () =>
        openModal(modalTambahArtikel)
    );

    tombolTutup.forEach((btn) => btn.addEventListener("click", closeAllModals));

    window.addEventListener("click", (e) => {
        if (e.target === modalTambahVideo || e.target === modalTambahArtikel) {
            closeAllModals();
        }
    });

    /* =====================
       CREATE DATA
    ===================== */
    formTambahVideo.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            nama_video: document.getElementById("tambah-nama-video").value,
            link_youtube: document.getElementById("tambah-link-video").value,
            deskripsi: document.getElementById("tambah-deskripsi").value,
        };

        try {
            showLoading();
            const res = await fetch(API_VIDEO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Gagal menambahkan video");

            await Swal.fire("Sukses", "Video berhasil ditambahkan", "success");
            closeAllModals();
            loadVideo();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    });

    formTambahArtikel.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(formTambahArtikel);

        try {
            showLoading();
            const res = await fetch(API_ARTIKEL, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Gagal menambahkan artikel");

            await Swal.fire(
                "Sukses",
                "Artikel berhasil ditambahkan",
                "success"
            );
            closeAllModals();
            loadArtikel();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    });

    /* =====================
       DELETE DATA
    ===================== */
    document.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("btn-hapus")) return;

        const id = e.target.dataset.id;
        const type = e.target.dataset.type;
        const API = type === "video" ? API_VIDEO : API_ARTIKEL;

        const confirm = await Swal.fire({
            title: "Yakin?",
            text: "Data akan dihapus permanen",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });

        if (!confirm.isConfirmed) return;

        try {
            showLoading();
            const res = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Gagal menghapus data");

            await Swal.fire("Terhapus", "Data berhasil dihapus", "success");
            type === "video" ? loadVideo() : loadArtikel();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        } finally {
            hideLoading();
        }
    });

    /* =====================
       INIT
    ===================== */
    loadVideo();
    loadArtikel();
});
