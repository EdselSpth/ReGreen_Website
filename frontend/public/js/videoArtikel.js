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

    const formSearchVideo = document.getElementById("search-video-form");
    const formSearchArtikel = document.getElementById("search-artikel-form");

    // ================= LOAD VIDEO =================
    async function loadVideo() {
        videoBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr>`;
        try {
            // Get total
            let total = 0;
            if (videoSearch) {
                const resCount = await fetch(`${API_VIDEO}/count-search?keyword=${encodeURIComponent(videoSearch)}`);
                const dataCount = await resCount.json();
                total = dataCount.total || 0;
            } else {
                const resCount = await fetch(`${API_VIDEO}/count`);
                const dataCount = await resCount.json();
                total = dataCount.total || 0;
            }

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
                <td><a href="${item.link_youtube}" target="_blank">Lihat Video</a></td>
                <td>${item.deskripsi}</td>
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

        const btnPrev = document.createElement("button");
        btnPrev.innerHTML = "⏮️ Prev";
        btnPrev.disabled = videoPage === 1;
        btnPrev.onclick = () => { videoPage--; loadVideo(); };
        videoPagination.appendChild(btnPrev);

        const btnNext = document.createElement("button");
        btnNext.innerHTML = "Next ⏭️";
        btnNext.disabled = videoPage === totalPage || totalPage === 0;
        btnNext.onclick = () => { videoPage++; loadVideo(); };
        videoPagination.appendChild(btnNext);
    }

    window.changeVideoPage = (page) => { videoPage = page; loadVideo(); };

    // ================= LOAD ARTIKEL =================
    async function loadArtikel() {
        artikelBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Memuat data...</td></tr>`;
        try {
            // Get total
            let total = 0;
            if (artikelSearch) {
                const resCount = await fetch(`${API_ARTIKEL}/count-search?keyword=${encodeURIComponent(artikelSearch)}`);
                const dataCount = await resCount.json();
                total = dataCount.total || 0;
            } else {
                const resCount = await fetch(`${API_ARTIKEL}/count`);
                const dataCount = await resCount.json();
                total = dataCount.total || 0;
            }

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
                <td><a href="/uploads/${item.file_pdf}" target="_blank">Lihat PDF</a></td>
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

        const btnPrev = document.createElement("button");
        btnPrev.innerHTML = "⏮️ Prev";
        btnPrev.disabled = artikelPage === 1;
        btnPrev.onclick = () => { artikelPage--; loadArtikel(); };
        artikelPagination.appendChild(btnPrev);

        const btnNext = document.createElement("button");
        btnNext.innerHTML = "Next ⏭️";
        btnNext.disabled = artikelPage === totalPage || totalPage === 0;
        btnNext.onclick = () => { artikelPage++; loadArtikel(); };
        artikelPagination.appendChild(btnNext);
    }

    window.changeArtikelPage = (page) => { artikelPage = page; loadArtikel(); };

    // ================= SEARCH =================
    if (formSearchVideo) {
        formSearchVideo.addEventListener("submit", e => {
            e.preventDefault();
            videoSearch = document.getElementById("search-video-input").value.trim();
            videoPage = 1;
            loadVideo();
        });
    }

    if (formSearchArtikel) {
        formSearchArtikel.addEventListener("submit", e => {
            e.preventDefault();
            artikelSearch = document.getElementById("search-artikel-input").value.trim();
            artikelPage = 1;
            loadArtikel();
        });
    }

    // ================= MODAL =================
    const openModal = (modal) => modal.classList.add("active");
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove("active");
        formTambahVideo?.reset();
        formTambahArtikel?.reset();
    };

    btnTambahVideo.addEventListener("click", () => openModal(modalTambahVideo));
    btnTambahArtikel.addEventListener("click", () => openModal(modalTambahArtikel));
    tombolTutup.forEach(btn => btn.addEventListener("click", () => {
        closeModal("modal-tambah-video");
        closeModal("modal-tambah-artikel");
    }));

    // ================= FORM SUBMIT =================
    if (formTambahVideo) {
        formTambahVideo.addEventListener("submit", async e => {
            e.preventDefault();
            const data = {
                nama_video: document.getElementById("tambah-nama-video").value,
                link_youtube: document.getElementById("tambah-link-video").value,
                deskripsi: document.getElementById("tambah-deskripsi").value
            };
            await handleRequest(API_VIDEO, "POST", data, "Menambah Video...", "Video berhasil ditambahkan", "modal-tambah-video", loadVideo);
        });
    }

    if (formTambahArtikel) {
        formTambahArtikel.addEventListener("submit", async e => {
            e.preventDefault();
            const fileInput = formTambahArtikel.querySelector("input[type=file]");
            const formData = new FormData();
            formData.append("nama_artikel", formTambahArtikel.nama_artikel.value);
            formData.append("file_pdf", fileInput.files[0]);

            try {
                Swal.fire({ title: "Menambah Artikel...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                const res = await fetch(API_ARTIKEL, { method: "POST", body: formData });
                const result = await res.json();
                if (res.ok) {
                    Swal.fire({ icon: "success", title: "Berhasil!", text: "Artikel berhasil ditambahkan", timer: 1500, showConfirmButton: false });
                    closeModal("modal-tambah-artikel");
                    loadArtikel();
                } else Swal.fire("Gagal!", result.message, "error");
            } catch (err) {
                Swal.fire("Error!", "Gagal koneksi server", "error");
            }
        });
    }

    async function handleRequest(url, method, data, loadingText, successText, modalId, callback) {
        try {
            Swal.fire({ title: loadingText, allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            const result = await res.json();
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Berhasil!", text: successText, timer: 1500, showConfirmButton: false });
                if (modalId) closeModal(modalId);
                if (callback) callback();
            } else {
                Swal.fire("Gagal!", result.message || "Terjadi kesalahan", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Gagal koneksi server", "error");
        }
    }

    // ================= DELETE =================
    window.deleteVideo = async (id, name) => {
        const confirm = await Swal.fire({
            title: `Hapus Video "${name}"?`,
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus!"
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
            confirmButtonText: "Ya, Hapus!"
        });
        if (confirm.isConfirmed) {
            await handleRequest(`${API_ARTIKEL}/${id}`, "DELETE", {}, "Menghapus Artikel...", "Artikel berhasil dihapus", null, loadArtikel);
        }
    };

    // ================= INIT =================
    loadVideo();
    loadArtikel();
});
