document.addEventListener("DOMContentLoaded", () => {
    console.log("videoArtikel.js loaded");

    const API_VIDEO = "http://localhost:3000/api/video";
    const API_ARTIKEL = "http://localhost:3000/api/artikel";
    const ITEMS_PER_PAGE = 2;

    // ===================== STATE =====================
    let videoPage = 1;
    let artikelPage = 1;
    let videoSearch = "";
    let artikelSearch = "";

    // ===================== ELEMENTS =====================
    const videoBody = document.getElementById("video-body");
    const artikelBody = document.getElementById("artikel-body");

    const videoPagination = document.getElementById("video-pagination");
    const artikelPagination = document.getElementById("artikel-pagination");

    const videoPageInfo = document.getElementById("video-page-info");
    const artikelPageInfo = document.getElementById("artikel-page-info");

    const modalTambahVideo = document.getElementById("modal-tambah-video");
    const modalTambahArtikel = document.getElementById("modal-tambah-artikel");
    const modalEditVideo = document.getElementById("modal-edit-video");
    const modalEditArtikel = document.getElementById("modal-edit-artikel");

    // === FORM EDIT VIDEO ===
    const editNamaVideo = document.getElementById("edit-nama-video");
    const editLinkVideo = document.getElementById("edit-link-video");
    const editDeskripsi = document.getElementById("edit-deskripsi");

    // === FORM EDIT ARTIKEL ===
    const editNamaArtikel = document.getElementById("edit-nama-artikel");
    const editLinkArtikel = document.getElementById("edit-link-artikel");

    // ===================== MODAL =====================
    const openModal = (modal) => modal?.classList.add("active");
    const closeModal = (modal) => modal?.classList.remove("active");

    document.querySelectorAll(".btn-tutup, .btn-batal").forEach((btn) => {
        btn.addEventListener("click", () => {
            closeModal(modalTambahVideo);
            closeModal(modalTambahArtikel);
            closeModal(modalEditVideo);
            closeModal(modalEditArtikel);
        });
    });

    document
        .getElementById("btnTambahVideo")
        ?.addEventListener("click", () => openModal(modalTambahVideo));

    document
        .getElementById("btnTambahArtikel")
        ?.addEventListener("click", () => openModal(modalTambahArtikel));

    // ===================== LOAD VIDEO =====================
    async function loadVideo() {
        const url = `${API_VIDEO}?page=${videoPage}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
            videoSearch
        )}`;

        const res = await fetch(url);
        const result = await res.json();

        const data = result.data?.data || [];
        const pagination = result.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: data.length,
        };

        renderVideoTable(data);
        renderVideoPagination(pagination);
    }

    function renderVideoTable(data) {
        videoBody.innerHTML = "";

        if (data.length === 0) {
            videoBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada video</td></tr>`;
            return;
        }

        data.forEach((item, index) => {
            videoBody.innerHTML += `
                <tr>
                    <td>${(videoPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>${item.nama_video}</td>
                    <td><a href="${
                        item.link_youtube
                    }" target="_blank">Lihat Video</a></td>
                    <td>${item.deskripsi || "-"}</td>
                    <td>
                        <button class="btn-aksi btn-edit btn-edit-video"
                            data-id="${item.id}"
                            data-nama="${item.nama_video}"
                            data-link="${item.link_youtube}"
                            data-deskripsi="${item.deskripsi || ""}">
                            ✏️ Edit
                        </button>
                        <button class="btn-aksi btn-hapus" data-id="${item.id}">
                            🗑️ Hapus
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    function renderVideoPagination({ currentPage, totalPages, totalItems }) {
        videoPageInfo.innerText = `Halaman ${currentPage} dari ${totalPages} (Total: ${totalItems})`;
        videoPagination.innerHTML = "";

        const prev = document.createElement("button");
        prev.textContent = "Previous";
        prev.disabled = currentPage === 1;
        prev.onclick = () => {
            videoPage--;
            loadVideo();
        };

        const next = document.createElement("button");
        next.textContent = "Next";
        next.disabled = currentPage === totalPages;
        next.onclick = () => {
            videoPage++;
            loadVideo();
        };

        videoPagination.append(prev, next);
    }

    // ===================== LOAD ARTIKEL =====================
    async function loadArtikel() {
        const url = `${API_ARTIKEL}?page=${artikelPage}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
            artikelSearch
        )}`;

        const res = await fetch(url);
        const result = await res.json();

        const data = result.data?.data || [];
        const pagination = result.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: data.length,
        };

        renderArtikelTable(data);
        renderArtikelPagination(pagination);
    }

    function renderArtikelTable(data) {
        artikelBody.innerHTML = "";

        if (data.length === 0) {
            artikelBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada artikel</td></tr>`;
            return;
        }

        data.forEach((item, index) => {
            artikelBody.innerHTML += `
                <tr>
                    <td>${(artikelPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>${item.nama_artikel}</td>
                    <td><a href="${
                        item.file_pdf
                    }" target="_blank">Baca Artikel</a></td>
                    <td>
                        <button class="btn-aksi btn-edit btn-edit-artikel"
                            data-id="${item.id}"
                            data-nama="${item.nama_artikel}"
                            data-link="${item.file_pdf}">
                            ✏️ Edit
                        </button>
                        <button class="btn-aksi btn-hapus" data-id="${item.id}">
                            🗑️ Hapus
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    function renderArtikelPagination({ currentPage, totalPages, totalItems }) {
        artikelPageInfo.innerText = `Halaman ${currentPage} dari ${totalPages} (Total: ${totalItems})`;
        artikelPagination.innerHTML = "";

        const prev = document.createElement("button");
        prev.textContent = "Previous";
        prev.disabled = currentPage === 1;
        prev.onclick = () => {
            artikelPage--;
            loadArtikel();
        };

        const next = document.createElement("button");
        next.textContent = "Next";
        next.disabled = currentPage === totalPages;
        next.onclick = () => {
            artikelPage++;
            loadArtikel();
        };

        artikelPagination.append(prev, next);
    }

    // ===================== SEARCH =====================
    document
        .getElementById("form-search-video")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();
            videoSearch = document
                .getElementById("search-video-input")
                .value.trim();
            videoPage = 1;
            loadVideo();
        });

    document
        .getElementById("form-search-artikel")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();
            artikelSearch = document
                .getElementById("search-artikel-input")
                .value.trim();
            artikelPage = 1;
            loadArtikel();
        });

    // ===================== HANDLE REQUEST =====================
    async function handleRequest(
        url,
        method,
        data,
        loading,
        success,
        modal,
        reload
    ) {
        Swal.fire({
            title: loading,
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
        });

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            Swal.fire("Berhasil", success, "success");
            closeModal(modal);
            reload();
        } else {
            Swal.fire("Gagal", "Terjadi kesalahan", "error");
        }
    }

    // ===================== ADD =====================
    document
        .getElementById("form-tambah-video")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();

            const nama = document.getElementById("tambah-nama-video").value;
            const link = document.getElementById("tambah-link-video").value;
            const deskripsi = document.getElementById("tambah-deskripsi").value;

            handleRequest(
                API_VIDEO,
                "POST",
                {
                    nama_video: nama,
                    link_youtube: link,
                    deskripsi: deskripsi,
                },
                "Menyimpan Video...",
                "Video berhasil ditambahkan",
                modalTambahVideo,
                () => {
                    loadVideo();
                    e.target.reset(); // reset form
                }
            );
        });

    document
        .getElementById("form-tambah-artikel")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();

            const nama = document.getElementById("tambah-nama-artikel").value;
            const link = document.getElementById("tambah-link-artikel").value;

            handleRequest(
                API_ARTIKEL,
                "POST",
                {
                    nama_artikel: nama,
                    file_pdf: link,
                },
                "Menyimpan Artikel...",
                "Artikel berhasil ditambahkan",
                modalTambahArtikel,
                () => {
                    loadArtikel();
                    e.target.reset();
                }
            );
        });

    // ===================== EDIT =====================
    videoBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-edit-video");
        if (!btn) return;

        document.getElementById("edit-video-id").value = btn.dataset.id;
        document.getElementById("edit-nama-video").value = btn.dataset.nama;
        document.getElementById("edit-link-video").value = btn.dataset.link;
        document.getElementById("edit-deskripsi").value = btn.dataset.deskripsi;

        openModal(modalEditVideo);
    });

    artikelBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-edit-artikel");
        if (!btn) return;

        document.getElementById("edit-artikel-id").value = btn.dataset.id;
        document.getElementById("edit-nama-artikel").value = btn.dataset.nama;
        document.getElementById("edit-link-artikel").value = btn.dataset.link;

        openModal(modalEditArtikel);
    });

    document
        .getElementById("form-edit-video")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("edit-video-id").value;

            handleRequest(
                `${API_VIDEO}/${id}`,
                "PUT",
                {
                    nama_video: editNamaVideo.value,
                    link_youtube: editLinkVideo.value,
                    deskripsi: editDeskripsi.value,
                },
                "Memperbarui Video...",
                "Video berhasil diperbarui",
                modalEditVideo,
                loadVideo
            );
        });

    document
        .getElementById("form-edit-artikel")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("edit-artikel-id").value;

            handleRequest(
                `${API_ARTIKEL}/${id}`,
                "PUT",
                {
                    nama_artikel: editNamaArtikel.value,
                    file_pdf: editLinkArtikel.value,
                },
                "Memperbarui Artikel...",
                "Artikel berhasil diperbarui",
                modalEditArtikel,
                loadArtikel
            );
        });

    // ===================== DELETE =====================
    videoBody.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-hapus");
        if (!btn) return;

        const ok = await Swal.fire({
            title: "Hapus Video?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus!",
        });

        if (ok.isConfirmed)
            handleRequest(
                `${API_VIDEO}/${btn.dataset.id}`,
                "DELETE",
                {},
                "Menghapus...",
                "Berhasil",
                null,
                loadVideo
            );
    });

    artikelBody.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-hapus");
        if (!btn) return;

        const ok = await Swal.fire({
            title: "Hapus Artikel?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus!",
        });

        if (ok.isConfirmed)
            handleRequest(
                `${API_ARTIKEL}/${btn.dataset.id}`,
                "DELETE",
                {},
                "Menghapus...",
                "Berhasil",
                null,
                loadArtikel
            );
    });

    // ===================== INIT =====================
    loadVideo();
    loadArtikel();
});
