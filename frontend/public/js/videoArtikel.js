document.addEventListener("DOMContentLoaded", () => {
    console.log("videoArtikel.js loaded");

    const API_VIDEO = "http://localhost:3000/api/video";
    const API_ARTIKEL = "http://localhost:3000/api/artikel";
    const ITEMS_PER_PAGE = 2;

    // === STATE ===
    let videoPage = 1,
        artikelPage = 1;
    let videoSearch = "",
        artikelSearch = "";
    let dataVideo = [],
        dataArtikel = [];

    // === ELEMENTS ===
    const videoBody = document.getElementById("video-body");
    const artikelBody = document.getElementById("artikel-body");
    const videoPagination = document.getElementById("video-pagination");
    const artikelPagination = document.getElementById("artikel-pagination");
    const videoPageInfo = document.getElementById("video-page-info");
    const artikelPageInfo = document.getElementById("artikel-page-info");

    const btnTambahVideo = document.getElementById("btnTambahVideo");
    const btnTambahArtikel = document.getElementById("btnTambahArtikel");
    const modalTambahVideo = document.getElementById("modal-tambah-video");
    const modalTambahArtikel = document.getElementById("modal-tambah-artikel");

    const formTambahVideo = document.getElementById("form-tambah-video");
    const formTambahArtikel = document.getElementById("form-tambah-artikel");

    const tombolTutup = document.querySelectorAll(".btn-tutup, .btn-batal");
    const formSearchVideo = document.getElementById("form-search-video");
    const formSearchArtikel = document.getElementById("form-search-artikel");

    const loadingOverlay = document.getElementById("loading-overlay");
    const showLoading = () => loadingOverlay?.classList.add("active");
    const hideLoading = () => loadingOverlay?.classList.remove("active");

    // ===================== LOAD VIDEO =====================
    // ===================== LOAD VIDEO =====================
    async function loadVideo() {
        try {
            showLoading();
            let url = `${API_VIDEO}?page=${videoPage}&limit=${ITEMS_PER_PAGE}`;
            if (videoSearch)
                url += `&search=${encodeURIComponent(videoSearch)}`;

            const res = await fetch(url);
            const result = await res.json();

            if (result.status !== "success")
                throw new Error(result.message || "Gagal memuat data");

            // <-- Ambil array video dan pagination
            dataVideo = Array.isArray(result.data.data) ? result.data.data : [];
            const pagination = result.data.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: dataVideo.length,
            };

            renderVideoTable(dataVideo, videoPage);
            renderVideoPagination(pagination);
        } catch (err) {
            console.error(err);
            videoBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">${err.message}</td></tr>`;
        } finally {
            hideLoading();
        }
    }

    function renderVideoPagination(pagination) {
        if (!pagination) return;
        videoPageInfo.innerText = `Total: ${pagination.totalItems}`;
        videoPagination.innerHTML = "";
    }

    function renderVideoTable(data, page) {
        videoBody.innerHTML = "";
        if (!data || data.length === 0) {
            videoBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada video</td></tr>`;
            return;
        }
        data.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>${item.nama_video}</td>
                <td><a href="${
                    item.link_youtube
                }" target="_blank">Lihat Video</a></td>
                <td>${item.deskripsi || "-"}</td>
                <td><button class="btn-aksi btn-hapus" data-id="${
                    item.id
                }">🗑️ Hapus</button></td>
            `;
            videoBody.appendChild(tr);
        });
    }

    function renderVideoPagination(pagination) {
        if (!pagination) return;
        const { currentPage, totalPages, totalItems } = pagination;
        videoPageInfo.innerText = `Halaman ${currentPage} dari ${totalPages} (Total: ${totalItems})`;
        videoPagination.innerHTML = "";

        const btnPrev = document.createElement("button");
        btnPrev.textContent = "Previous";
        btnPrev.disabled = currentPage === 1;
        btnPrev.onclick = () => {
            videoPage--;
            loadVideo();
        };

        const btnNext = document.createElement("button");
        btnNext.textContent = "Next";
        btnNext.disabled = currentPage === totalPages || totalPages === 0;
        btnNext.onclick = () => {
            videoPage++;
            loadVideo();
        };

        videoPagination.appendChild(btnPrev);
        videoPagination.appendChild(btnNext);
    }

    // ===================== LOAD ARTIKEL =====================
    async function loadArtikel() {
        try {
            showLoading();
            let url = API_ARTIKEL;
            if (artikelSearch)
                url += `?search=${encodeURIComponent(artikelSearch)}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Gagal koneksi ke server");

            const result = await res.json();
            if (result.status !== "success")
                throw new Error(result.message || "Gagal memuat data");

            // Ambil array artikel dari result.data.data
            dataArtikel = Array.isArray(result.data.data)
                ? result.data.data
                : [];
            const paginationArtikel = result.data.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: dataArtikel.length,
            };

            renderArtikelTable(dataArtikel, artikelPage);
            renderArtikelPagination(paginationArtikel);
        } catch (err) {
            console.error(err);
            artikelBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">${err.message}</td></tr>`;
        } finally {
            hideLoading();
        }
    }

    function renderArtikelPagination(pagination) {
        if (!pagination) return;
        artikelPageInfo.innerText = `Total: ${pagination.totalItems}`;
        artikelPagination.innerHTML = "";
    }

    function renderArtikelTable(data, page) {
        artikelBody.innerHTML = "";
        if (!data || data.length === 0) {
            artikelBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada artikel</td></tr>`;
            return;
        }
        data.forEach((item, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>${item.nama_artikel}</td>
                <td><a href="${
                    item.file_pdf
                }" target="_blank">Baca Artikel</a></td>
                <td><button class="btn-aksi btn-hapus" data-id="${
                    item.id
                }">🗑️ Hapus</button></td>
            `;
            artikelBody.appendChild(tr);
        });
    }

    function renderArtikelPagination(pagination) {
        if (!pagination) return;
        const { currentPage, totalPages, totalItems } = pagination;
        artikelPageInfo.innerText = `Halaman ${currentPage} dari ${totalPages} (Total: ${totalItems})`;
        artikelPagination.innerHTML = "";

        const btnPrev = document.createElement("button");
        btnPrev.textContent = "Previous";
        btnPrev.disabled = currentPage === 1;
        btnPrev.onclick = () => {
            artikelPage--;
            loadArtikel();
        };

        const btnNext = document.createElement("button");
        btnNext.textContent = "Next";
        btnNext.disabled = currentPage === totalPages || totalPages === 0;
        btnNext.onclick = () => {
            artikelPage++;
            loadArtikel();
        };

        artikelPagination.appendChild(btnPrev);
        artikelPagination.appendChild(btnNext);
    }

    // ===================== SEARCH =====================
    formSearchVideo?.addEventListener("submit", (e) => {
        e.preventDefault();
        videoSearch = document
            .getElementById("search-video-input")
            .value.trim();
        videoPage = 1;
        loadVideo();
    });

    formSearchArtikel?.addEventListener("submit", (e) => {
        e.preventDefault();
        artikelSearch = document
            .getElementById("search-artikel-input")
            .value.trim();
        artikelPage = 1;
        loadArtikel();
    });

    // ===================== MODAL =====================
    const openModal = (modal) => modal?.classList.add("active");
    const closeModal = (modal) => modal?.classList.remove("active");

    btnTambahVideo?.addEventListener("click", () =>
        openModal(modalTambahVideo)
    );
    btnTambahArtikel?.addEventListener("click", () =>
        openModal(modalTambahArtikel)
    );
    tombolTutup.forEach((btn) =>
        btn.addEventListener("click", () => {
            closeModal(modalTambahVideo);
            closeModal(modalTambahArtikel);
        })
    );

    // ===================== FORM SUBMIT =====================
    formTambahVideo?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            nama_video: document.getElementById("tambah-nama-video").value,
            link_youtube: document.getElementById("tambah-link-video").value,
            deskripsi: document.getElementById("tambah-deskripsi").value,
        };
        await handleRequest(
            API_VIDEO,
            "POST",
            data,
            "Menambahkan Video...",
            "Video berhasil ditambahkan",
            modalTambahVideo,
            loadVideo
        );
    });

    formTambahArtikel?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            nama_artikel: document.getElementById("tambah-nama-artikel").value,
            file_pdf: document.getElementById("tambah-link-artikel").value,
        };
        await handleRequest(
            API_ARTIKEL,
            "POST",
            data,
            "Menambahkan Artikel...",
            "Artikel berhasil ditambahkan",
            modalTambahArtikel,
            loadArtikel
        );
    });

    async function handleRequest(
        url,
        method,
        data,
        loadingText,
        successText,
        modal,
        callback
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
                closeModal(modal);
                callback?.();
            } else {
                Swal.fire(
                    "Gagal!",
                    result.message || "Terjadi kesalahan",
                    "error"
                );
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Gagal koneksi ke server", "error");
        }
    }

    // ===================== DELETE =====================
    videoBody.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!id || !e.target.classList.contains("btn-hapus")) return;
        const confirm = await Swal.fire({
            title: "Hapus Video?",
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!",
        });
        if (confirm.isConfirmed)
            await handleRequest(
                `${API_VIDEO}/${id}`,
                "DELETE",
                {},
                "Menghapus Video...",
                "Video berhasil dihapus",
                null,
                loadVideo
            );
    });

    artikelBody.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!id || !e.target.classList.contains("btn-hapus")) return;
        const confirm = await Swal.fire({
            title: "Hapus Artikel?",
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!",
        });
        if (confirm.isConfirmed)
            await handleRequest(
                `${API_ARTIKEL}/${id}`,
                "DELETE",
                {},
                "Menghapus Artikel...",
                "Artikel berhasil dihapus",
                null,
                loadArtikel
            );
    });

    // ===================== INIT LOAD =====================
    loadVideo();
    loadArtikel();
});
