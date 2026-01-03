document.addEventListener("DOMContentLoaded", () => {
    console.log("videoArtikel.js loaded");

    const API_VIDEO = "http://localhost:3000/api/video";
    const API_ARTIKEL = "http://localhost:3000/api/artikel";
    const ITEMS_PER_PAGE = 2;

    //STATE
    let videoPage = 1;
    let artikelPage = 1;
    let videoSearch = "";
    let artikelSearch = "";
    let videoData = [];
    let artikelData = [];
    let allVideoData = [];
    let allArtikelData = [];

    //ELEMEN
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

    const editNamaVideo = document.getElementById("edit-nama-video");
    const editLinkVideo = document.getElementById("edit-link-video");
    const editDeskripsi = document.getElementById("edit-deskripsi");

    const editNamaArtikel = document.getElementById("edit-nama-artikel");
    const editLinkArtikel = document.getElementById("edit-link-artikel");

    //MODAL
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

    //DUPLIKAT
    function isDuplicate(
        dataList,
        namaKey,
        linkKey,
        nama,
        link,
        excludeId = null
    ) {
        return dataList.some((item) => {
            if (excludeId && item.id == excludeId) return false;

            return (
                item[namaKey].trim().toLowerCase() ===
                    nama.trim().toLowerCase() &&
                item[linkKey].trim().toLowerCase() === link.trim().toLowerCase()
            );
        });
    }

    async function loadAllVideo() {
        const res = await fetch(`${API_VIDEO}?limit=10000`);
        const result = await res.json();
        allVideoData = result.data?.data || [];
    }

    async function loadAllArtikel() {
        const res = await fetch(`${API_ARTIKEL}?limit=10000`);
        const result = await res.json();
        allArtikelData = result.data?.data || [];
    }

    //LOAD VIDEO
    async function loadVideo() {
        const url = `${API_VIDEO}?page=${videoPage}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
            videoSearch
        )}`;

        const res = await fetch(url);
        const result = await res.json();

        const data = result.data?.data || [];
        videoData = data;

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

    function renderVideoPagination(pagination) {
        if (!pagination) return;

        const {
            currentPage: apiCurrentPage,
            totalPages,
            totalItems,
        } = pagination;

        videoPageInfo.innerText = `Halaman ${apiCurrentPage} dari ${totalPages} (Total: ${totalItems})`;
        videoPagination.innerHTML = "";

        if (totalPages <= 1) return;

        // PREV
        const btnPrev = document.createElement("button");
        btnPrev.innerHTML = "&laquo; Prev";
        btnPrev.className = "btn-pagination";
        btnPrev.disabled = apiCurrentPage === 1;
        btnPrev.onclick = () => {
            if (videoPage > 1) {
                videoPage--;
                loadVideo();
            }
        };
        videoPagination.appendChild(btnPrev);

        let startPage, endPage;

        if (totalPages <= 7) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (apiCurrentPage <= 4) {
                startPage = 1;
                endPage = 5;
            } else if (apiCurrentPage + 3 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = apiCurrentPage - 2;
                endPage = apiCurrentPage + 2;
            }
        }

        if (startPage > 1) {
            addVideoPageButton(1, apiCurrentPage);
            if (startPage > 2) videoPagination.appendChild(createDots());
        }

        for (let i = startPage; i <= endPage; i++) {
            addVideoPageButton(i, apiCurrentPage);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1)
                videoPagination.appendChild(createDots());
            addVideoPageButton(totalPages, apiCurrentPage);
        }

        // NEXT
        const btnNext = document.createElement("button");
        btnNext.innerHTML = "Next &raquo;";
        btnNext.className = "btn-pagination";
        btnNext.disabled = apiCurrentPage === totalPages;
        btnNext.onclick = () => {
            if (videoPage < totalPages) {
                videoPage++;
                loadVideo();
            }
        };
        videoPagination.appendChild(btnNext);
    }

    function addVideoPageButton(pageNumber, currentPage) {
        const btn = document.createElement("button");
        btn.innerText = pageNumber;
        btn.className = "btn-pagination";

        if (pageNumber === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            videoPage = pageNumber;
            loadVideo();
        };

        videoPagination.appendChild(btn);
    }

    function createDots() {
        const span = document.createElement("span");
        span.innerText = "...";
        span.style.padding = "6px";
        return span;
    }

    //LOAD ARTIKEL
    async function loadArtikel() {
        const url = `${API_ARTIKEL}?page=${artikelPage}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
            artikelSearch
        )}`;

        const res = await fetch(url);
        const result = await res.json();

        const data = result.data?.data || [];
        artikelData = data;
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

    function renderArtikelPagination(pagination) {
        if (!pagination) return;

        const {
            currentPage: apiCurrentPage,
            totalPages,
            totalItems,
        } = pagination;

        artikelPageInfo.innerText = `Halaman ${apiCurrentPage} dari ${totalPages} (Total: ${totalItems})`;
        artikelPagination.innerHTML = "";

        if (totalPages <= 1) return;

        // === PREV ===
        const btnPrev = document.createElement("button");
        btnPrev.innerHTML = "&laquo; Prev";
        btnPrev.className = "btn-pagination";
        btnPrev.disabled = apiCurrentPage === 1;
        btnPrev.onclick = () => {
            if (artikelPage > 1) {
                artikelPage--;
                loadArtikel();
            }
        };
        artikelPagination.appendChild(btnPrev);

        let startPage, endPage;

        if (totalPages <= 7) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (apiCurrentPage <= 4) {
                startPage = 1;
                endPage = 5;
            } else if (apiCurrentPage + 3 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = apiCurrentPage - 2;
                endPage = apiCurrentPage + 2;
            }
        }

        if (startPage > 1) {
            addArtikelPageButton(1, apiCurrentPage);
            if (startPage > 2) artikelPagination.appendChild(createDots());
        }

        for (let i = startPage; i <= endPage; i++) {
            addArtikelPageButton(i, apiCurrentPage);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1)
                artikelPagination.appendChild(createDots());
            addArtikelPageButton(totalPages, apiCurrentPage);
        }

        // === NEXT ===
        const btnNext = document.createElement("button");
        btnNext.innerHTML = "Next &raquo;";
        btnNext.className = "btn-pagination";
        btnNext.disabled = apiCurrentPage === totalPages;
        btnNext.onclick = () => {
            if (artikelPage < totalPages) {
                artikelPage++;
                loadArtikel();
            }
        };
        artikelPagination.appendChild(btnNext);
    }

    function addArtikelPageButton(pageNumber, currentPage) {
        const btn = document.createElement("button");
        btn.innerText = pageNumber;
        btn.className = "btn-pagination";

        if (pageNumber === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            artikelPage = pageNumber;
            loadArtikel();
        };

        artikelPagination.appendChild(btn);
    }

    function createDots() {
        const span = document.createElement("span");
        span.innerText = "...";
        span.style.padding = "6px";
        return span;
    }

    //SEARCH
    const searchVideoInput = document.getElementById("search-video-input");
    if (searchVideoInput) {
        searchVideoInput.addEventListener("input", () => {
            videoSearch = searchVideoInput.value;
            videoPage = 1;
            loadVideo();
        });
    }

    const searchArtikelInput = document.getElementById("search-artikel-input");
    if (searchArtikelInput) {
        searchArtikelInput.addEventListener("input", () => {
            artikelSearch = searchArtikelInput.value;
            artikelPage = 1;
            loadArtikel();
        });
    }

    //REQ HANDLER
    async function handleRequest(
        url,
        method,
        data,
        loading,
        success,
        modal,
        reload,
        refreshAll
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
            refreshAll && refreshAll();
        } else {
            Swal.fire("Gagal", "Terjadi kesalahan", "error");
        }
    }

    //CREATE
    document
        .getElementById("form-tambah-video")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();

            const nama = document.getElementById("tambah-nama-video").value;
            const link = document.getElementById("tambah-link-video").value;
            const deskripsi = document.getElementById("tambah-deskripsi").value;

            if (
                isDuplicate(
                    allVideoData,
                    "nama_video",
                    "link_youtube",
                    nama,
                    link
                )
            ) {
                Swal.fire(
                    "Gagal",
                    "Video dengan nama dan link yang sama sudah ada",
                    "warning"
                );
                return;
            }

            handleRequest(
                API_VIDEO,
                "POST",
                {
                    nama_video: nama,
                    link_youtube: link,
                    deskripsi,
                },
                "Menyimpan Video...",
                "Video berhasil ditambahkan",
                modalTambahVideo,
                () => {
                    loadVideo();
                    e.target.reset();
                },
                loadAllVideo
            );
        });

    document
        .getElementById("form-tambah-artikel")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();

            const nama = document.getElementById("tambah-nama-artikel").value;
            const link = document.getElementById("tambah-link-artikel").value;

            if (
                isDuplicate(
                    allArtikelData,
                    "nama_artikel",
                    "file_pdf",
                    nama,
                    link
                )
            ) {
                Swal.fire(
                    "Gagal",
                    "Artikel dengan nama dan file yang sama sudah ada",
                    "warning"
                );
                return;
            }

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
                },
                loadAllArtikel
            );
        });

    //EDIT
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

            if (
                isDuplicate(
                    allVideoData,
                    "nama_video",
                    "link_youtube",
                    editNamaVideo.value,
                    editLinkVideo.value,
                    id
                )
            ) {
                Swal.fire(
                    "Gagal",
                    "Video dengan nama dan link tersebut sudah ada",
                    "warning"
                );
                return;
            }

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
                loadVideo,
                loadAllVideo
            );
        });

    document
        .getElementById("form-edit-artikel")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("edit-artikel-id").value;

            if (
                isDuplicate(
                    allArtikelData,
                    "nama_artikel",
                    "file_pdf",
                    editNamaArtikel.value,
                    editLinkArtikel.value,
                    id
                )
            ) {
                Swal.fire(
                    "Gagal",
                    "Artikel dengan nama dan file tersebut sudah ada",
                    "warning"
                );
                return;
            }

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
                loadArtikel,
                loadAllArtikel
            );
        });

    // DELETE
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
                loadVideo,
                loadAllVideo
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
                loadArtikel,
                loadAllArtikel
            );
    });

    // INIT
    loadVideo();
    loadArtikel();
    loadAllVideo();
    loadAllArtikel();
});
