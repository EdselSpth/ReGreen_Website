document.addEventListener("DOMContentLoaded", () => {
    console.log("videoArtikel.js loaded");

    const API_VIDEO = "http://localhost:3000/api/video";
    const API_ARTIKEL = "http://localhost:3000/api/artikel";
    const ITEMS_PER_PAGE = 2;

    // === State ===
    let videoPage = 1;
    let artikelPage = 1;
    let videoSearch = "";
    let artikelSearch = "";

    // === Elements ===
    const videoBody = document.getElementById("video-body");
    const artikelBody = document.getElementById("artikel-body");
    const videoPagination = document.getElementById("video-pagination");
    const artikelPagination = document.getElementById("artikel-pagination");

    const btnTambahVideo = document.getElementById("btnTambahVideo");
    const btnTambahArtikel = document.getElementById("btnTambahArtikel");
    const modalTambahVideo = document.getElementById("modal-tambah-video");
    const modalTambahArtikel = document.getElementById("modal-tambah-artikel");
    
    const formTambahVideo = document.getElementById("form-tambah-video");
    const formTambahArtikel = document.getElementById("form-tambah-artikel");
    const tombolTutup = document.querySelectorAll(".btn-tutup, .btn-batal");

    // ID Form Search disesuaikan dengan HTML (form-search-video)
    const formSearchVideo = document.getElementById("form-search-video");
    const formSearchArtikel = document.getElementById("form-search-artikel");

    // ================= LOAD VIDEO =================
    async function loadVideo() {
        videoBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Memuat data video...</td></tr>`;
        try {
            // 1. Ambil Total Data untuk Pagination
            let countUrl = videoSearch 
                ? `${API_VIDEO}/count-search?keyword=${encodeURIComponent(videoSearch)}`
                : `${API_VIDEO}/count`;
            
            const resCount = await fetch(countUrl);
            const dataCount = await resCount.json();
            const total = dataCount.total || 0;

            // 2. Ambil Data dengan Limit & Offset
            const offset = (videoPage - 1) * ITEMS_PER_PAGE;
            let url = `${API_VIDEO}?limit=${ITEMS_PER_PAGE}&offset=${offset}`;
            if (videoSearch) url += `&search=${encodeURIComponent(videoSearch)}`;

            const res = await fetch(url);
            const result = await res.json();
            
            renderVideo(result.data || []);
            renderVideoPagination(total);
        } catch (err) {
            console.error(err);
            videoBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Gagal memuat data</td></tr>`;
        }
    }

    function renderVideo(data) {
        videoBody.innerHTML = "";
        if (!data.length) {
            videoBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada video</td></tr>`;
            return;
        }
        const start = (videoPage - 1) * ITEMS_PER_PAGE;
        data.forEach((item, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${start + i + 1}</td>
                <td>${item.nama_video}</td>
                <td><a href="${item.link_youtube}" target="_blank" class="btn-link">Lihat Video</a></td>
                <td>${item.deskripsi || '-'}</td>
                <td>
                    <button class="btn-aksi btn-hapus" onclick="deleteVideo('${item.id}', '${item.nama_video}')">🗑️ Hapus</button>
                </td>
            `;
            videoBody.appendChild(tr);
        });
    }

    function renderVideoPagination(totalData) {
        const totalPage = Math.ceil(totalData / ITEMS_PER_PAGE);
        videoPagination.innerHTML = "";

        if (totalPage <= 1 && totalData > 0) {
             videoPagination.innerHTML = `<span class="page-info">Halaman 1 dari 1</span>`;
             return;
        }

        const btnPrev = document.createElement("button");
        btnPrev.className = "btn-page";
        btnPrev.innerHTML = "<< Prev";
        btnPrev.disabled = videoPage === 1;
        btnPrev.onclick = () => { videoPage--; loadVideo(); };
        videoPagination.appendChild(btnPrev);

        const pageInfo = document.createElement("span");
        pageInfo.className = "page-info";
        pageInfo.innerText = ` Hal ${videoPage} / ${totalPage || 1} `;
        videoPagination.appendChild(pageInfo);

        const btnNext = document.createElement("button");
        btnNext.className = "btn-page";
        btnNext.innerHTML = "Next >>";
        btnNext.disabled = videoPage >= totalPage || totalPage === 0;
        btnNext.onclick = () => { videoPage++; loadVideo(); };
        videoPagination.appendChild(btnNext);
    }

    // ================= LOAD ARTIKEL =================
    async function loadArtikel() {
        artikelBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Memuat data artikel...</td></tr>`;
        try {
            // 1. Ambil Total Data
            let countUrl = artikelSearch 
                ? `${API_ARTIKEL}/count-search?keyword=${encodeURIComponent(artikelSearch)}`
                : `${API_ARTIKEL}/count`;

            const resCount = await fetch(countUrl);
            const dataCount = await resCount.json();
            const total = dataCount.total || 0;

            // 2. Ambil Data
            const offset = (artikelPage - 1) * ITEMS_PER_PAGE;
            let url = `${API_ARTIKEL}?limit=${ITEMS_PER_PAGE}&offset=${offset}`;
            if (artikelSearch) url += `&search=${encodeURIComponent(artikelSearch)}`;

            const res = await fetch(url);
            const result = await res.json();

            renderArtikel(result.data || []);
            renderArtikelPagination(total);
        } catch (err) {
            console.error(err);
            artikelBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Gagal memuat data</td></tr>`;
        }
    }

    function renderArtikel(data) {
        artikelBody.innerHTML = "";
        if (!data.length) {
            artikelBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada artikel</td></tr>`;
            return;
        }
        const start = (artikelPage - 1) * ITEMS_PER_PAGE;
        data.forEach((item, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${start + i + 1}</td>
                <td>${item.nama_artikel}</td>
                <td><a href="${item.file_pdf}" target="_blank" class="btn-link">Baca Artikel</a></td>
                <td>
                    <button class="btn-aksi btn-hapus" onclick="deleteArtikel('${item.id}', '${item.nama_artikel}')">🗑️ Hapus</button>
                </td>
            `;
            artikelBody.appendChild(tr);
        });
    }

    function renderArtikelPagination(totalData) {
        const totalPage = Math.ceil(totalData / ITEMS_PER_PAGE);
        artikelPagination.innerHTML = "";

        if (totalPage <= 1 && totalData > 0) {
            artikelPagination.innerHTML = `<span class="page-info">Halaman 1 dari 1</span>`;
            return;
        }

        const btnPrev = document.createElement("button");
        btnPrev.className = "btn-page";
        btnPrev.innerHTML = "<< Prev";
        btnPrev.disabled = artikelPage === 1;
        btnPrev.onclick = () => { artikelPage--; loadArtikel(); };
        artikelPagination.appendChild(btnPrev);

        const pageInfo = document.createElement("span");
        pageInfo.className = "page-info";
        pageInfo.innerText = ` Hal ${artikelPage} / ${totalPage || 1} `;
        artikelPagination.appendChild(pageInfo);

        const btnNext = document.createElement("button");
        btnNext.className = "btn-page";
        btnNext.innerHTML = "Next >>";
        btnNext.disabled = artikelPage >= totalPage || totalPage === 0;
        btnNext.onclick = () => { artikelPage++; loadArtikel(); };
        artikelPagination.appendChild(btnNext);
    }

    // ================= SEARCH HANDLERS =================
    if (formSearchVideo) {
        formSearchVideo.addEventListener("submit", (e) => {
            e.preventDefault();
            videoSearch = document.getElementById("search-video-input").value.trim();
            videoPage = 1;
            loadVideo();
        });
    }

    if (formSearchArtikel) {
        formSearchArtikel.addEventListener("submit", (e) => {
            e.preventDefault();
            artikelSearch = document.getElementById("search-artikel-input").value.trim();
            artikelPage = 1;
            loadArtikel();
        });
    }

    // ================= MODAL HANDLERS =================
    const openModal = (modal) => modal.classList.add("active");
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove("active");
        formTambahVideo?.reset();
        formTambahArtikel?.reset();
    };

    btnTambahVideo.addEventListener("click", () => openModal(modalTambahVideo));
    btnTambahArtikel.addEventListener("click", () => openModal(modalTambahArtikel));
    
    tombolTutup.forEach((btn) =>
        btn.addEventListener("click", () => {
            closeModal("modal-tambah-video");
            closeModal("modal-tambah-artikel");
        })
    );

    // ================= FORM SUBMISSION =================
    // Submit Video
    if (formTambahVideo) {
        formTambahVideo.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
                nama_video: document.getElementById("tambah-nama-video").value,
                link_youtube: document.getElementById("tambah-link-video").value,
                deskripsi: document.getElementById("tambah-deskripsi").value,
            };
            await handleRequest(API_VIDEO, "POST", data, "Menambah Video...", "Video berhasil ditambahkan", "modal-tambah-video", loadVideo);
        });
    }

    // Submit Artikel (URL dipetakan ke field file_pdf agar backend menerima)
    if (formTambahArtikel) {
        formTambahArtikel.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
                nama_artikel: document.getElementById("tambah-nama-artikel").value,
                // PENTING: Mengirim link ke field 'file_pdf' agar lolos validasi backend Anda
                file_pdf: document.getElementById("tambah-link-artikel").value, 
            };
            await handleRequest(API_ARTIKEL, "POST", data, "Menambah Artikel...", "Artikel berhasil ditambahkan", "modal-tambah-artikel", loadArtikel);
        });
    }

    // Generic Request Handler
    async function handleRequest(url, method, data, loadingText, successText, modalId, callback) {
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
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: successText,
                    timer: 1500,
                    showConfirmButton: false,
                });
                if (modalId) closeModal(modalId);
                if (callback) callback();
            } else {
                Swal.fire("Gagal!", result.message || "Terjadi kesalahan pada server", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Gagal koneksi ke server", "error");
        }
    }

    // ================= DELETE HANDLERS =================
    window.deleteVideo = async (id, name) => {
        const confirm = await Swal.fire({
            title: `Hapus Video "${name}"?`,
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!",
        });
        if (confirm.isConfirmed) {
            await handleRequest(`${API_VIDEO}/${id}`, "DELETE", {}, "Menghapus Video...", "Video berhasil dihapus", null, loadVideo);
        }
    };

    window.deleteArtikel = async (id, name) => {
        const confirm = await Swal.fire({
            title: `Hapus Artikel "${name}"?`,
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!",
        });
        if (confirm.isConfirmed) {
            await handleRequest(`${API_ARTIKEL}/${id}`, "DELETE", {}, "Menghapus Artikel...", "Artikel berhasil dihapus", null, loadArtikel);
        }
    };

    // ================= INITIAL LOAD =================
    loadVideo();
    loadArtikel();
});